export function getValidationError(
  value: string,
  minLength: number,
): string | null {
  if (value.length === 0) {
    return 'This field is mandatory';
  }

  if (value.length < minLength) {
    return `Minimum length is ${minLength} characters`;
  }

  if (!/^[A-Z]/.test(value)) {
    return 'First letter must be uppercase';
  }

  if (!/^[a-zA-Z-]+$/.test(value)) {
    return 'Only English alphabet letters and hyphen are allowed';
  }

  return null;
}
