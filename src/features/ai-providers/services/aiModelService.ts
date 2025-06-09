import { api } from "@/services/api";
import type { AiModel } from "@/features/ai-providers/types";

class AiModelService {
  async getAll(): Promise<AiModel[]> {
    const response = await api.get("/api/ai-models");

    return response.data;
  }
}

export const aiModelService = new AiModelService();
