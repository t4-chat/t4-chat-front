// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from "@tanstack/react-query";
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
import { AggregationType } from "../requests/types.gen";
import * as Common from "./common";
export const prefetchUseHealthServiceGetHealthLive = (
  queryClient: QueryClient
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseHealthServiceGetHealthLiveKeyFn(),
    queryFn: () => HealthService.getHealthLive(),
  });
export const prefetchUseAiProvidersServiceGetApiAiProviders = (
  queryClient: QueryClient
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
export const prefetchUseChatsServiceGetApiChatsByChatId = (
  queryClient: QueryClient,
  {
    chatId,
  }: {
    chatId: string;
  }
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
  }
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdMessagesKeyFn({
      chatId,
    }),
    queryFn: () => ChatsService.getApiChatsByChatIdMessages({ chatId }),
  });
export const prefetchUseUsersServiceGetApiUsersCurrent = (
  queryClient: QueryClient
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUsersServiceGetApiUsersCurrentKeyFn(),
    queryFn: () => UsersService.getApiUsersCurrent(),
  });
export const prefetchUseAiModelsServiceGetApiAiModels = (
  queryClient: QueryClient
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
  }
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseFilesServiceGetApiFilesByFileIdKeyFn({ fileId }),
    queryFn: () => FilesService.getApiFilesByFileId({ fileId }),
  });
export const prefetchUseUtilizationServiceGetApiUtilization = (
  queryClient: QueryClient
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationKeyFn(),
    queryFn: () => UtilizationService.getApiUtilization(),
  });
export const prefetchUseUtilizationServiceGetApiUtilizationLimits = (
  queryClient: QueryClient
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationLimitsKeyFn(),
    queryFn: () => UtilizationService.getApiUtilizationLimits(),
  });
export const prefetchUseAdminServiceGetApiAdminBudget = (
  queryClient: QueryClient
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
    modelId?: number;
    startDate?: string;
    userId?: string;
  } = {}
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
