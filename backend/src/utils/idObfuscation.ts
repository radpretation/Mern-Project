/**
 * Matches legacy CodeIgniter ID_encode / ID_decode in application/helpers/function_helper.php
 */
export function idEncode(id: number | string): string {
  if (!id) return '';
  const numId = Number(id);
  const prefix = Math.floor(1111 + Math.random() * 8888);
  const suffix = Math.floor(1111 + Math.random() * 8888);
  return `${prefix}${numId + 19}${suffix}`;
}

export function idDecode(encodedId: string): number {
  if (!encodedId || encodedId.length < 9) return 0;
  try {
    const rawNumberStr = encodedId.substring(4, encodedId.length - 4);
    const decoded = Number(rawNumberStr) - 19;
    return isNaN(decoded) ? 0 : decoded;
  } catch {
    return 0;
  }
}
