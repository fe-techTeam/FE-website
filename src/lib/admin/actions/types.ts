/**
 * Shared shape returned by every admin server action.
 *
 * Lives outside the `"use server"` files because those may only export async
 * functions — a constant or a non-async helper there is a build error.
 */
export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const idleState: ActionState = { ok: false };

export function fieldErrorsOf(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
