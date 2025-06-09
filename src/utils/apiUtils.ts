import { providerIconPaths } from "@/assets/icons/ai-providers";
import type { SelectOption } from "@/components/ui-kit/Select/Select";
import {
  useAiModelsServiceGetApiAiModels,
  useChatsServiceGetApiChats,
} from "../../openapi/queries/queries";
import { useState } from "react";

export const getProviderIconPath = (provider: string): string => {
  return (
    providerIconPaths[
      provider.toLowerCase() as keyof typeof providerIconPaths
    ] || providerIconPaths.default
  );
};

export const useAIModelsForChat = (initialModelId: string | null) => {
  const { data: models, ...other } = useAiModelsServiceGetApiAiModels();
  const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  if (!models) {
    return { ...other, modelOptions: [], selectedModel: null };
  }
  const options = models.map((model) => ({
    value: model.id.toString(),
    label: model.name,
    iconPath: getProviderIconPath(model.provider.slug),
  }));

  setModelOptions(options);

  // Set the initial model if provided, otherwise use the first model
  if (
    initialModelId &&
    options.some((option) => option.value === initialModelId)
  ) {
    setSelectedModel(initialModelId);
  } else if (options.length > 0 && !selectedModel) {
    setSelectedModel(options[0].value);
  }
  return { ...other, modelOptions, selectedModel };
};

export const useChats = () => {
  const { data: chats, ...other } = useChatsServiceGetApiChats();

  if (!chats) {
    return { ...other, chats: [] };
  }

  const chatsWithDateObjects = chats.map((chat) => ({
    ...chat,
    created_at: new Date(chat.created_at),
    updated_at: new Date(chat.updated_at),
  }));

  return { ...other, chats: chatsWithDateObjects };
};
