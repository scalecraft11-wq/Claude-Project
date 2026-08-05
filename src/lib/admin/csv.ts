/**
 * Browser-side CSV export for admin DataTables — every export button
 * converts the table's currently filtered/sorted rows, not a fresh
 * server fetch, so the CSV always matches what the operator is looking at.
 */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function rowsToCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(csvCell).join(","));
  return lines.join("\n");
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: unknown[][],
): void {
  const csv = rowsToCsv(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
