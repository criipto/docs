export type OidcTokenResponse = {
  token_type: 'Bearer';
  expires_in: number;
  id_token: string;
  access_token: string;
  error?: string;
  error_description?: string;
};
