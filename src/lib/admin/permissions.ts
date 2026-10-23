/**
 * Feature 2 — roles and per-module permissions.
 *
 * A role sets the default capability for every module; a ModulePermission row
 * overrides it for one module. SUPER_ADMIN always wins and cannot be locked out.
 *
 * Client-safe — no server-only imports.
 */

import type { Role } from "@/generated/prisma/enums";

export type Capability = "view" | "edit" | "publish" | "delete";

export type ModuleAccess = {
  view: boolean;
  edit: boolean;
  publish: boolean;
  delete: boolean;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  title: string | null;
  /** Overrides keyed by module key. */
  permissions: Record<string, Partial<ModuleAccess>>;
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  EDITOR: "Editor",
  AUTHOR: "Author",
  VIEWER: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Full access, including users, permissions and system tools.",
  EDITOR: "Create, edit and publish content across all modules.",
  AUTHOR: "Create and edit drafts, then submit them for review.",
  VIEWER: "Read-only access to content and the dashboard.",
};

const ROLE_DEFAULTS: Record<Role, ModuleAccess> = {
  SUPER_ADMIN: { view: true, edit: true, publish: true, delete: true },
  EDITOR: { view: true, edit: true, publish: true, delete: true },
  AUTHOR: { view: true, edit: true, publish: false, delete: false },
  VIEWER: { view: true, edit: false, publish: false, delete: false },
};

/** Admin-only areas that are not content modules. */
export type AdminArea = "users" | "audit" | "system" | "health";

const AREA_ROLES: Record<AdminArea, Role[]> = {
  users: ["SUPER_ADMIN"],
  system: ["SUPER_ADMIN"],
  audit: ["SUPER_ADMIN", "EDITOR"],
  health: ["SUPER_ADMIN", "EDITOR", "AUTHOR"],
};

export function roleDefaults(role: Role): ModuleAccess {
  return ROLE_DEFAULTS[role];
}

export function moduleAccess(user: SessionUser, moduleKey: string): ModuleAccess {
  if (user.role === "SUPER_ADMIN") return ROLE_DEFAULTS.SUPER_ADMIN;

  const base = ROLE_DEFAULTS[user.role];
  const override = user.permissions[moduleKey];
  if (!override) return base;

  return {
    view: override.view ?? base.view,
    edit: override.edit ?? base.edit,
    publish: override.publish ?? base.publish,
    delete: override.delete ?? base.delete,
  };
}

export function can(user: SessionUser, capability: Capability, moduleKey: string): boolean {
  const access = moduleAccess(user, moduleKey);
  if (capability === "view") return access.view;
  // Editing implies viewing; publishing implies editing.
  if (!access.view) return false;
  if (capability === "edit") return access.edit;
  if (capability === "delete") return access.edit && access.delete;
  return access.edit && access.publish;
}

export function canAccessArea(user: SessionUser, area: AdminArea): boolean {
  return AREA_ROLES[area].includes(user.role);
}

export function visibleModuleKeys(user: SessionUser, keys: string[]): string[] {
  return keys.filter((key) => can(user, "view", key));
}

/** True when the user may move a draft to IN_REVIEW but not publish it. */
export function mustRequestReview(user: SessionUser, moduleKey: string): boolean {
  return can(user, "edit", moduleKey) && !can(user, "publish", moduleKey);
}
