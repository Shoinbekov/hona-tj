// Strips minus signs (ASCII "-" and the Unicode minus "−") so a numeric text field
// can never hold a negative value, whether typed, pasted, or spun via a
// stepper/mouse wheel.
export function clampNonNegative(value: string): string {
  return value.replace(/[-−]/g, '');
}
