import { api } from 'src/services/api';
import { AiProvider } from "src/features/ai-providers/types";

class AIProvidersService {
  async getProviders(): Promise<AiProvider[]> {
    const response = await api.get<AiProvider[]>('/api/ai-providers');

    return response.data;
  }
}

export const aiProvidersService = new AIProvidersService();
