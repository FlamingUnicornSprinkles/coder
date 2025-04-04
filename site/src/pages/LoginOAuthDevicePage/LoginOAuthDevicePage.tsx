import type { ApiErrorResponse } from "api/errors";
import {
	getGitHubDevice,
	getGitHubDeviceFlowCallback,
} from "api/queries/oauth2";
import { isAxiosError } from "axios";
import {
	isExchangeErrorRetryable,
	newRetryDelay,
} from "components/GitDeviceAuth/GitDeviceAuth";
import { SignInLayout } from "components/SignInLayout/SignInLayout";
import { Welcome } from "components/Welcome/Welcome";
import { useEffect, useMemo } from "react";
import type { FC } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import LoginOAuthDevicePageView from "./LoginOAuthDevicePageView";

// The page is hardcoded to only use GitHub,
// as that's the only OAuth2 login provider in our backend
// that currently supports the device flow.
const LoginOAuthDevicePage: FC = () => {
	const [searchParams] = useSearchParams();

	const state = searchParams.get("state");
	if (!state) {
		return (
			<SignInLayout>
				<Welcome>Missing OAuth2 state</Welcome>
			</SignInLayout>
		);
	}

	const externalAuthDeviceQuery = useQuery({
		...getGitHubDevice(),
		refetchOnMount: false,
	});

	const retryDelay = useMemo(
		() => newRetryDelay(externalAuthDeviceQuery.data?.interval),
		[externalAuthDeviceQuery.data],
	);

	const exchangeExternalAuthDeviceQuery = useQuery({
		...getGitHubDeviceFlowCallback(
			externalAuthDeviceQuery.data?.device_code ?? "",
			state,
		),
		enabled: Boolean(externalAuthDeviceQuery.data),
		retry: isExchangeErrorRetryable,
		retryDelay,
		// We don't want to refetch the query outside of the standard retry
		// logic, because the device auth flow is very strict about rate limits.
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (!exchangeExternalAuthDeviceQuery.isSuccess) {
			return;
		}
		// We use window.location.href in lieu of a navigate hook
		// because we need to refresh the page after the GitHub
		// callback query sets a session cookie.
		window.location.href = exchangeExternalAuthDeviceQuery.data.redirect_url;
	}, [
		exchangeExternalAuthDeviceQuery.isSuccess,
		exchangeExternalAuthDeviceQuery.data?.redirect_url,
	]);

	let deviceExchangeError: ApiErrorResponse | undefined;
	if (isAxiosError(exchangeExternalAuthDeviceQuery.failureReason)) {
		deviceExchangeError =
			exchangeExternalAuthDeviceQuery.failureReason.response?.data;
	} else if (isAxiosError(externalAuthDeviceQuery.failureReason)) {
		deviceExchangeError = externalAuthDeviceQuery.failureReason.response?.data;
	}

	return (
		<LoginOAuthDevicePageView
			authenticated={exchangeExternalAuthDeviceQuery.isSuccess}
			redirectUrl={exchangeExternalAuthDeviceQuery.data?.redirect_url ?? "/"}
			deviceExchangeError={deviceExchangeError}
			externalAuthDevice={externalAuthDeviceQuery.data}
		/>
	);
};

export default LoginOAuthDevicePage;
