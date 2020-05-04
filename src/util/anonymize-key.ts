const ANONYMIZED_KEY_LENGTH: number = 10;

export function anonymizeKey(key: string): string {
  return `...${key.substr(
    key.length - ANONYMIZED_KEY_LENGTH,
    ANONYMIZED_KEY_LENGTH
  )}`;
}
