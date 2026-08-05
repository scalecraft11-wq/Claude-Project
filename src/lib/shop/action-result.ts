/**
 * Shared result shape for every storefront Server Action — same contract
 * as `lib/admin/action-result.ts`, kept separate so customer-facing action
 * modules don't import from the admin tree.
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
