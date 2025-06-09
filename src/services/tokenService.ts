import type { OpenAPIConfig } from "../../openapi/requests/core/OpenAPI";

class TokenService {
  readonly TOKEN_KEY = "auth_token";
  private openApiConfig: OpenAPIConfig;

  constructor(openApiConfig: OpenAPIConfig) {
    this.openApiConfig = openApiConfig;
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.openApiConfig.TOKEN = `Bearer ${token}`;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.openApiConfig.TOKEN = undefined;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export a function to create the service instead of a singleton
export const createTokenService = (openApiConfig: OpenAPIConfig) =>
  new TokenService(openApiConfig);
