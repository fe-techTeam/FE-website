import { z } from "zod";

/** Shared validation for admin server actions. Client-safe. */

const password = z
  .string()
  .min(10, { error: "Use at least 10 characters." })
  .regex(/[a-z]/, { error: "Include a lowercase letter." })
  .regex(/[A-Z]/, { error: "Include an uppercase letter." })
  .regex(/[0-9]/, { error: "Include a number." });

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Enter your password." }),
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim().toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, { error: "This reset link is not valid." }),
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Enter your current password." }),
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const roleSchema = z.enum(["SUPER_ADMIN", "EDITOR", "AUTHOR", "VIEWER"]);

export const inviteUserSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim().toLowerCase(),
  name: z.string().trim().min(2, { error: "Enter the person's name." }),
  title: z.string().trim().max(80).optional(),
  role: roleSchema,
});

export const updateUserSchema = z.object({
  userId: z.string().min(1),
  name: z.string().trim().min(2, { error: "Enter the person's name." }),
  title: z.string().trim().max(80).optional(),
  role: roleSchema,
  status: z.enum(["ACTIVE", "INVITED", "DISABLED"]),
});

// Content types live in the database now, so the shape is validated here and
// existence is checked by the action that uses it.
const moduleKey = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, { error: "Unknown content type." });

export const permissionSchema = z.object({
  userId: z.string().min(1),
  module: moduleKey,
  canView: z.boolean(),
  canEdit: z.boolean(),
  canPublish: z.boolean(),
  canDelete: z.boolean(),
});

export const entryIdSchema = z.object({ entryId: z.string().min(1) });

export const scheduleSchema = z.object({
  entryId: z.string().min(1),
  publishAt: z
    .string()
    .min(1, { error: "Pick a date and time." })
    .refine((value) => !Number.isNaN(Date.parse(value)), { error: "That is not a valid date." }),
});

export const rollbackSchema = z.object({
  entryId: z.string().min(1),
  versionId: z.string().min(1),
});

export const importSchema = z.object({
  moduleKeys: z.array(moduleKey).optional(),
  onExisting: z.enum(["skip", "overwrite"]).default("skip"),
  publish: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ---------------------------------------------------------------------------
// Content structure
// ---------------------------------------------------------------------------

const structureKey = z
  .string()
  .trim()
  .min(2, { error: "Keys need at least two characters." })
  .max(48)
  .regex(/^[a-z][a-z0-9-]*$/, {
    error: "Use lowercase letters, numbers and hyphens, starting with a letter.",
  });

export const structureKeySchema = z.object({ key: structureKey });

export const contentTypeSchema = z.object({
  id: z.string().optional(),
  key: structureKey,
  label: z.string().trim().min(2, { error: "Enter a label." }),
  singular: z.string().trim().min(2, { error: "Enter a singular name." }),
  kind: z.enum(["COLLECTION", "SINGLETON"]),
  group: z.string().trim().min(2, { error: "Enter a sidebar group." }),
  icon: z.string().trim().min(1),
  description: z.string().trim().max(300),
  detailPath: z
    .string()
    .trim()
    .regex(/^\//, { error: "Paths must start with a slash." })
    .optional(),
  revalidatePaths: z.array(z.string().trim().regex(/^\//, { error: "Paths must start with a slash." })),
  orderable: z.boolean(),
  usesSections: z.boolean(),
  allowedSectionKeys: z.array(z.string()),
  enabled: z.boolean(),
});

export const sectionTypeSchema = z.object({
  id: z.string().optional(),
  key: structureKey,
  label: z.string().trim().min(2, { error: "Enter a label." }),
  description: z.string().trim().max(300),
  icon: z.string().trim().min(1),
  group: z.string().trim().min(1),
  enabled: z.boolean(),
});

export const sectionInstanceSchema = z.object({
  entryId: z.string().min(1),
  sectionType: z.string().min(1),
});

export const sectionMoveSchema = z.object({
  entryId: z.string().min(1),
  sectionId: z.string().min(1),
  direction: z.enum(["up", "down"]),
});

export const sectionToggleSchema = z.object({
  entryId: z.string().min(1),
  sectionId: z.string().min(1),
});
