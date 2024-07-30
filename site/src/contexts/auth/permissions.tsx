export const checks = {
  viewAllUsers: "viewAllUsers",
  updateUsers: "updateUsers",
  createUser: "createUser",
  viewAnyAuditLog: "viewAnyAuditLog",
  createAnyTemplate: "createAnyTemplate",
  updateAllTemplates: "updateAllTemplates",
  viewDeploymentValues: "viewDeploymentValues",
  viewUpdateCheck: "viewUpdateCheck",
  viewExternalAuthConfig: "viewExternalAuthConfig",
  viewDeploymentStats: "viewDeploymentStats",
  editWorkspaceProxies: "editWorkspaceProxies",
} as const;

export const permissionsToCheck = {
  [checks.viewAllUsers]: {
    object: {
      resource_type: "user",
    },
    action: "read",
  },
  [checks.updateUsers]: {
    object: {
      resource_type: "user",
    },
    action: "update",
  },
  [checks.createUser]: {
    object: {
      resource_type: "user",
    },
    action: "create",
  },
  [checks.createAnyTemplate]: {
    object: {
      resource_type: "template",
      any_org: true,
    },
    action: "update",
  },
  [checks.updateAllTemplates]: {
    object: {
      resource_type: "template",
    },
    action: "update",
  },
  [checks.viewAnyAuditLog]: {
    object: {
      resource_type: "audit_log",
      any_org: true,
    },
    action: "read",
  },
  [checks.viewDeploymentValues]: {
    object: {
      resource_type: "deployment_config",
    },
    action: "read",
  },
  [checks.viewUpdateCheck]: {
    object: {
      resource_type: "deployment_config",
    },
    action: "read",
  },
  [checks.viewExternalAuthConfig]: {
    object: {
      resource_type: "deployment_config",
    },
    action: "read",
  },
  [checks.viewDeploymentStats]: {
    object: {
      resource_type: "deployment_stats",
    },
    action: "read",
  },
  [checks.editWorkspaceProxies]: {
    object: {
      resource_type: "workspace_proxy",
    },
    action: "create",
  },
} as const;

export type Permissions = Record<keyof typeof permissionsToCheck, boolean>;
