import sanitizeHtml from "sanitize-html";

/**
 * Strips all HTML from user-supplied free text before it's ever stored —
 * defense in depth at the input boundary. React already escapes anything
 * rendered as text (there's no `dangerouslySetInnerHTML` path for
 * customer-authored content in this app), so this isn't closing an
 * active XSS hole; it's making sure one can never open even if a future
 * change ever renders this text as HTML instead of as a React string.
 */
export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}
