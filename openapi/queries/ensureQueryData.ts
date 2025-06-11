// generated with @7nohe/openapi-react-query-codegen@1.6.2

import type { QueryClient } from "@tanstack/react-query";
import {
  AdminService,
  AiModelsService,
  AiProvidersService,
  ChatsService,
  FilesService,
  HealthService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
import type { AggregationType } from "../requests/types.gen";
import * as Common from "./common";
export const ensureUseHealthServiceGetHealthLiveData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseHealthServiceGetHealthLiveKeyFn(),
    queryFn: () => HealthService.getHealthLive(),
  });
export const ensureUseAiProvidersServiceGetApiAiProvidersData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseAiProvidersServiceGetApiAiProvidersKeyFn(),
    queryFn: () => AiProvidersService.getApiAiProviders(),
  });
export const ensureUseChatsServiceGetApiChatsData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseChatsServiceGetApiChatsKeyFn(),
    queryFn: () => ChatsService.getApiChats(),
  });
export const ensureUseChatsServiceGetApiChatsByChatIdData = (
  queryClient: QueryClient,
  {
    chatId,
  }: {
    chatId: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdKeyFn({ chatId }),
    queryFn: () => ChatsService.getApiChatsByChatId({ chatId }),
  });
export const ensureUseChatsServiceGetApiChatsByChatIdMessagesData = (
  queryClient: QueryClient,
  {
    chatId,
  }: {
    chatId: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdMessagesKeyFn({
      chatId,
    }),
    queryFn: () => ChatsService.getApiChatsByChatIdMessages({ chatId }),
  });
export const ensureUseUsersServiceGetApiUsersCurrentData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUsersServiceGetApiUsersCurrentKeyFn(),
    queryFn: () => UsersService.getApiUsersCurrent(),
  });
export const ensureUseAiModelsServiceGetApiAiModelsData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseAiModelsServiceGetApiAiModelsKeyFn(),
    queryFn: () => AiModelsService.getApiAiModels(),
  });
export const ensureUseFilesServiceGetApiFilesByFileIdData = (
  queryClient: QueryClient,
  {
    fileId,
  }: {
    fileId: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseFilesServiceGetApiFilesByFileIdKeyFn({ fileId }),
    queryFn: () => FilesService.getApiFilesByFileId({ fileId }),
  });
export const ensureUseUtilizationServiceGetApiUtilizationData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationKeyFn(),
    queryFn: () => UtilizationService.getApiUtilization(),
  });
export const ensureUseUtilizationServiceGetApiUtilizationLimitsData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationLimitsKeyFn(),
    queryFn: () => UtilizationService.getApiUtilizationLimits(),
  });
export const ensureUseAdminServiceGetApiAdminBudgetData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseAdminServiceGetApiAdminBudgetKeyFn(),
    queryFn: () => AdminService.getApiAdminBudget(),
  });
export const ensureUseAdminServiceGetApiAdminUsageData = (
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
    modelId?: number;
    startDate?: string;
    userId?: string;
  } = {},
) =>
  queryClient.ensureQueryData({
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
