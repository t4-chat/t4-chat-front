import { providerIconPaths } from "@/assets/icons/ai-providers";
import { useState } from "react";
import {
  useAiModelsServiceGetApiAiModels,
  useChatsServiceGetApiChats,
} from "~/openapi/queries/queries";

export const getProviderIconPath = (provider: string): string => {
  return (
    providerIconPaths[
      provider.toLowerCase() as keyof typeof providerIconPaths
    ] || providerIconPaths.default
  );
};

export const useAIModelsForChat = (initialModelId: string | null) => {
  const { data: models, ...other } = useAiModelsServiceGetApiAiModels();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  if (!models) {
    return {
      ...other,
      setSelectedModel,
      modelOptions: [],
      selectedModel: null,
    };
  }
  const options = models.map((model) => ({
    value: model.id.toString(),
    label: model.name,
    iconPath: getProviderIconPath(model.provider.slug),
  }));

  // Set the initial model if provided, otherwise use the first model
  if (
    initialModelId &&
    options.some((option) => option.value === initialModelId) &&
    selectedModel !== initialModelId
  ) {
    setSelectedModel(initialModelId);
  } else if (
    options.length > 0 &&
    !selectedModel &&
    selectedModel !== options[0].value
  ) {
    setSelectedModel(options[0].value);
  }
  return { ...other, modelOptions: options, selectedModel, setSelectedModel };
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
