/** Password rules, shared by the server hashing module and the client forms. */

export const PASSWORD_RULES = [
  "At least 10 characters",
  "One uppercase and one lowercase letter",
  "One number",
] as const;

export function passwordIssues(value: string): string[] {
  const issues: string[] = [];
  if (value.length < 10) issues.push(PASSWORD_RULES[0]);
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) issues.push(PASSWORD_RULES[1]);
  if (!/[0-9]/.test(value)) issues.push(PASSWORD_RULES[2]);
  return issues;
}
