import type { AuthorizationCheck } from "api/typesGenerated";

export type OrganizationPermissions = {
	[k in OrganizationPermissionName]: boolean;
};

export type OrganizationPermissionName = keyof ReturnType<
	typeof organizationPermissionChecks
>;

export const organizationPermissionChecks = (organizationId: string) =>
	({
		viewMembers: {
			object: {
				resource_type: "organization_member",
				organization_id: organizationId,
			},
			action: "read",
		},
		editMembers: {
			object: {
				resource_type: "organization_member",
				organization_id: organizationId,
			},
			action: "update",
		},
		createGroup: {
			object: {
				resource_type: "group",
				organization_id: organizationId,
			},
			action: "create",
		},
		viewGroups: {
			object: {
				resource_type: "group",
				organization_id: organizationId,
			},
			action: "read",
		},
		editGroups: {
			object: {
				resource_type: "group",
				organization_id: organizationId,
			},
			action: "update",
		},
		editSettings: {
			object: {
				resource_type: "organization",
				organization_id: organizationId,
			},
			action: "update",
		},
		assignOrgRoles: {
			object: {
				resource_type: "assign_org_role",
				organization_id: organizationId,
			},
			action: "assign",
		},
		viewOrgRoles: {
			object: {
				resource_type: "assign_org_role",
				organization_id: organizationId,
			},
			action: "read",
		},
		createOrgRoles: {
			object: {
				resource_type: "assign_org_role",
				organization_id: organizationId,
			},
			action: "create",
		},
		updateOrgRoles: {
			object: {
				resource_type: "assign_org_role",
				organization_id: organizationId,
			},
			action: "update",
		},
		deleteOrgRoles: {
			object: {
				resource_type: "assign_org_role",
				organization_id: organizationId,
			},
			action: "delete",
		},
		viewProvisioners: {
			object: {
				resource_type: "provisioner_daemon",
				organization_id: organizationId,
			},
			action: "read",
		},
		viewProvisionerJobs: {
			object: {
				resource_type: "provisioner_jobs",
				organization_id: organizationId,
			},
			action: "read",
		},
		viewIdpSyncSettings: {
			object: {
				resource_type: "idpsync_settings",
				organization_id: organizationId,
			},
			action: "read",
		},
		editIdpSyncSettings: {
			object: {
				resource_type: "idpsync_settings",
				organization_id: organizationId,
			},
			action: "update",
		},
	}) as const satisfies Record<string, AuthorizationCheck>;

/**
 * Checks if the user can view or edit members or groups for the organization
 * that produced the given OrganizationPermissions.
 */
export const canViewOrganization = (
	permissions: OrganizationPermissions | undefined,
): permissions is OrganizationPermissions => {
	return (
		permissions !== undefined &&
		(permissions.viewMembers ||
			permissions.viewGroups ||
			permissions.viewProvisioners ||
			permissions.viewIdpSyncSettings)
	);
};

/**
 * Return true if the user can edit the organization settings or its members.
 */
export const canEditOrganization = (
	permissions: OrganizationPermissions | undefined,
): permissions is OrganizationPermissions => {
	return (
		permissions !== undefined &&
		(permissions.editMembers ||
			permissions.editGroups ||
			permissions.editSettings ||
			permissions.assignOrgRoles ||
			permissions.editIdpSyncSettings ||
			permissions.createOrgRoles)
	);
};
