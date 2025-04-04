import { type Interpolation, type Theme, useTheme } from "@emotion/react";
import { AlphaBadge, DeprecatedBadge } from "components/Badges/Badges";
import { Stack } from "components/Stack/Stack";
import {
	type ComponentProps,
	type FC,
	type HTMLProps,
	type ReactNode,
	createContext,
	forwardRef,
	useContext,
} from "react";
import { cn } from "utils/cn";

type FormContextValue = { direction?: "horizontal" | "vertical" };

const FormContext = createContext<FormContextValue>({
	direction: "horizontal",
});

type FormProps = HTMLProps<HTMLFormElement> & {
	direction?: FormContextValue["direction"];
};

export const Form: FC<FormProps> = ({ direction, ...formProps }) => {
	const theme = useTheme();

	return (
		<FormContext.Provider value={{ direction }}>
			<form
				{...formProps}
				css={{
					display: "flex",
					flexDirection: "column",
					gap: direction === "horizontal" ? 80 : 40,

					[theme.breakpoints.down("md")]: {
						gap: 64,
					},
				}}
			/>
		</FormContext.Provider>
	);
};

export const HorizontalForm: FC<HTMLProps<HTMLFormElement>> = ({
	children,
	...formProps
}) => {
	return (
		<Form direction="horizontal" {...formProps}>
			{children}
		</Form>
	);
};

export const VerticalForm: FC<HTMLProps<HTMLFormElement>> = ({
	children,
	...formProps
}) => {
	return (
		<Form direction="vertical" {...formProps}>
			{children}
		</Form>
	);
};

interface FormSectionProps {
	children?: ReactNode;
	title: ReactNode;
	description: ReactNode;
	classes?: {
		root?: string;
		sectionInfo?: string;
		infoTitle?: string;
	};
	alpha?: boolean;
	deprecated?: boolean;
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
	(
		{
			children,
			title,
			description,
			classes = {},
			alpha = false,
			deprecated = false,
		},
		ref,
	) => {
		const { direction } = useContext(FormContext);

		return (
			<section
				ref={ref}
				css={[
					styles.formSection,
					direction === "horizontal" && styles.formSectionHorizontal,
				]}
				className={classes.root}
			>
				<div
					css={[
						styles.formSectionInfo,
						direction === "horizontal" && styles.formSectionInfoHorizontal,
					]}
					className={classes.sectionInfo}
				>
					<h2 css={styles.formSectionInfoTitle} className={classes.infoTitle}>
						{title}
						{alpha && <AlphaBadge />}
						{deprecated && <DeprecatedBadge />}
					</h2>
					<div css={styles.formSectionInfoDescription}>{description}</div>
				</div>

				{children}
			</section>
		);
	},
);

export const FormFields: FC<ComponentProps<typeof Stack>> = (props) => {
	return (
		<Stack
			direction="column"
			spacing={3}
			{...props}
			css={styles.formSectionFields}
		/>
	);
};

const styles = {
	formSection: (theme) => ({
		display: "flex",
		alignItems: "flex-start",
		flexDirection: "column",
		gap: 24,

		[theme.breakpoints.down("lg")]: {
			flexDirection: "column",
			gap: 16,
		},
	}),
	formSectionHorizontal: {
		flexDirection: "row",
		gap: 120,
	},
	formSectionInfo: (theme) => ({
		width: "100%",
		flexShrink: 0,
		top: 24,

		[theme.breakpoints.down("md")]: {
			width: "100%",
			position: "initial" as const,
		},
	}),
	formSectionInfoHorizontal: {
		maxWidth: 312,
		position: "sticky",
	},
	formSectionInfoTitle: (theme) => ({
		fontSize: 20,
		color: theme.palette.text.primary,
		fontWeight: 500,
		margin: 0,
		marginBottom: 8,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	}),

	formSectionInfoDescription: (theme) => ({
		fontSize: 14,
		color: theme.palette.text.secondary,
		lineHeight: "160%",
		margin: 0,
	}),

	formSectionFields: {
		width: "100%",
	},
} satisfies Record<string, Interpolation<Theme>>;

export const FormFooter: FC<HTMLProps<HTMLDivElement>> = ({
	className,
	...props
}) => (
	<footer
		className={cn("flex items-center justify-end space-x-2 mt-2", className)}
		{...props}
	/>
);
