// generated with @7nohe/openapi-react-query-codegen@1.6.2

import type { QueryClient } from "@tanstack/react-query";
import {
  AdminService,
  AiModelsService,
  AiProvidersService,
  ChatsService,
  FilesService,
  HealthChecksService,
  HostApiKeysService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
import type { AggregationType } from "../requests/types.gen";
import * as Common from "./common";
export const prefetchUseHealthChecksServiceGetHealthLive = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseHealthChecksServiceGetHealthLiveKeyFn(),
    queryFn: () => HealthChecksService.getHealthLive(),
  });
export const prefetchUseAiProvidersServiceGetApiAiProviders = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAiProvidersServiceGetApiAiProvidersKeyFn(),
    queryFn: () => AiProvidersService.getApiAiProviders(),
  });
export const prefetchUseChatsServiceGetApiChats = (queryClient: QueryClient) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseChatsServiceGetApiChatsKeyFn(),
    queryFn: () => ChatsService.getApiChats(),
  });
export const prefetchUseChatsServiceGetApiChatsShared = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseChatsServiceGetApiChatsSharedKeyFn(),
    queryFn: () => ChatsService.getApiChatsShared(),
  });
export const prefetchUseChatsServiceGetApiChatsSharedBySharedConversationId = (
  queryClient: QueryClient,
  {
    sharedConversationId,
  }: {
    sharedConversationId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey:
      Common.UseChatsServiceGetApiChatsSharedBySharedConversationIdKeyFn({
        sharedConversationId,
      }),
    queryFn: () =>
      ChatsService.getApiChatsSharedBySharedConversationId({
        sharedConversationId,
      }),
  });
export const prefetchUseChatsServiceGetApiChatsByChatId = (
  queryClient: QueryClient,
  {
    chatId,
  }: {
    chatId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdKeyFn({ chatId }),
    queryFn: () => ChatsService.getApiChatsByChatId({ chatId }),
  });
export const prefetchUseChatsServiceGetApiChatsByChatIdMessages = (
  queryClient: QueryClient,
  {
    chatId,
  }: {
    chatId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdMessagesKeyFn({
      chatId,
    }),
    queryFn: () => ChatsService.getApiChatsByChatIdMessages({ chatId }),
  });
export const prefetchUseUsersServiceGetApiUsersCurrent = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUsersServiceGetApiUsersCurrentKeyFn(),
    queryFn: () => UsersService.getApiUsersCurrent(),
  });
export const prefetchUseAdminServiceGetApiAdminAiModels = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAdminServiceGetApiAdminAiModelsKeyFn(),
    queryFn: () => AdminService.getApiAdminAiModels(),
  });
export const prefetchUseAdminServiceGetApiAdminAiModelsByAiModelId = (
  queryClient: QueryClient,
  {
    aiModelId,
  }: {
    aiModelId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAdminServiceGetApiAdminAiModelsByAiModelIdKeyFn({
      aiModelId,
    }),
    queryFn: () => AdminService.getApiAdminAiModelsByAiModelId({ aiModelId }),
  });
export const prefetchUseAdminServiceGetApiAdminModelHosts = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAdminServiceGetApiAdminModelHostsKeyFn(),
    queryFn: () => AdminService.getApiAdminModelHosts(),
  });
export const prefetchUseAdminServiceGetApiAdminModelHostsByHostId = (
  queryClient: QueryClient,
  {
    hostId,
  }: {
    hostId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAdminServiceGetApiAdminModelHostsByHostIdKeyFn({
      hostId,
    }),
    queryFn: () => AdminService.getApiAdminModelHostsByHostId({ hostId }),
  });
export const prefetchUseAdminServiceGetApiAdminBudget = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAdminServiceGetApiAdminBudgetKeyFn(),
    queryFn: () => AdminService.getApiAdminBudget(),
  });
export const prefetchUseAdminServiceGetApiAdminUsage = (
  queryClient: QueryClient,
  {
    aggregation,
    endDate,
    modelId,
    startDate,
    userId,
  }: {
    aggregation?: AggregationType;
    endDate?: string;
    modelId?: string;
    startDate?: string;
    userId?: string;
  } = {},
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAdminServiceGetApiAdminUsageKeyFn({
      aggregation,
      endDate,
      modelId,
      startDate,
      userId,
    }),
    queryFn: () =>
      AdminService.getApiAdminUsage({
        aggregation,
        endDate,
        modelId,
        startDate,
        userId,
      }),
  });
export const prefetchUseAiModelsServiceGetApiAiModels = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseAiModelsServiceGetApiAiModelsKeyFn(),
    queryFn: () => AiModelsService.getApiAiModels(),
  });
export const prefetchUseFilesServiceGetApiFilesByFileId = (
  queryClient: QueryClient,
  {
    fileId,
  }: {
    fileId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseFilesServiceGetApiFilesByFileIdKeyFn({ fileId }),
    queryFn: () => FilesService.getApiFilesByFileId({ fileId }),
  });
export const prefetchUseHostApiKeysServiceGetApiHostApiKeys = (
  queryClient: QueryClient,
  {
    hostId,
  }: {
    hostId?: string;
  } = {},
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseHostApiKeysServiceGetApiHostApiKeysKeyFn({ hostId }),
    queryFn: () => HostApiKeysService.getApiHostApiKeys({ hostId }),
  });
export const prefetchUseHostApiKeysServiceGetApiHostApiKeysByKeyId = (
  queryClient: QueryClient,
  {
    keyId,
  }: {
    keyId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseHostApiKeysServiceGetApiHostApiKeysByKeyIdKeyFn({
      keyId,
    }),
    queryFn: () => HostApiKeysService.getApiHostApiKeysByKeyId({ keyId }),
  });
export const prefetchUseUtilizationServiceGetApiUtilization = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationKeyFn(),
    queryFn: () => UtilizationService.getApiUtilization(),
  });
export const prefetchUseUtilizationServiceGetApiUtilizationLimits = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationLimitsKeyFn(),
    queryFn: () => UtilizationService.getApiUtilizationLimits(),
  });
