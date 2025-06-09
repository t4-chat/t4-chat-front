import { api } from "@/services/api";
import type { AiProvider } from "@/features/ai-providers/types";

class AIProvidersService {
  async getProviders(): Promise<AiProvider[]> {
    const response = await api.get<AiProvider[]>("/api/ai-providers");

    return response.data;
  }
}

export const aiProvidersService = new AIProvidersService();
