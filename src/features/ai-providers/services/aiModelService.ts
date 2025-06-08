import { api } from "src/services/api";
import { AiModel } from "src/features/ai-providers/types";

class AiModelService {
  async getAll(): Promise<AiModel[]> {
    const response = await api.get(`/api/ai-models`);

    return response.data;
  }
}

export const aiModelService = new AiModelService();
