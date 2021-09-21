export interface Config {
  apiKey: string;
  apiUrl: string;
  locale: string;
}

export interface OAuthURLConfig{
  apiUrl: string;
  organizationId: string;
  userId: string;
  key: string;
  redirectUrl?: string
}