import { api } from "@/services/api";
import { tokenService } from "@/services/tokenService";

export interface AuthResponse {
	access_token: string;
}

export interface GoogleAuthResponse {
	credential: string;
}

class AuthService {
	setToken(token: string): void {
		tokenService.setToken(token);
	}

	getToken(): string | null {
		return tokenService.getToken();
	}

	removeToken(): void {
		tokenService.removeToken();
	}

	isAuthenticated(): boolean {
		return tokenService.isAuthenticated();
	}

	async loginWithGoogle(googleToken: string): Promise<void> {
		try {
			const response = await api.post("/api/auth/google", {
				token: googleToken,
			});
			const { access_token } = response.data;

			this.setToken(access_token);
		} catch (error) {
			console.error("Google authentication error:", error);
			throw error;
		}
	}

	logout(): void {
		this.removeToken();
	}
}

export const authService = new AuthService();
