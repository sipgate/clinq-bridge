export interface Config {
  apiKey: string;
  apiUrl: string;
  locale: string;
}

export interface OAuthURLConfig {
  apiUrl: string;
  organizationId: string;
  userId: string;
  key: string;
  clinqEnvironment?: ClinqBetaEnvironment;
}

export enum ClinqBetaEnvironment {
  DEV = "dev",
  LIVE = "live"
}