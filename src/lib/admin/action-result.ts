/**
 * Shared result shape for every admin Server Action — same contract as
 * `lib/auth/actions.ts`'s `ActionResult`, kept as its own plain (non
 * "use server") module so admin action files can import the type without
 * pulling in auth-specific server action exports.
 */
export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export function fieldErrorsFromZod(flatten: {
  fieldErrors: Record<string, string[] | undefined>;
}): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const [field, errors] of Object.entries(flatten.fieldErrors)) {
    if (errors?.length) result[field] = errors;
  }
  return result;
}
