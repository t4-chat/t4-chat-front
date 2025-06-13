// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  AdminService,
  AiModelsService,
  AiProvidersService,
  ChatsService,
  FilesService,
  HealthChecksService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
import type { AggregationType } from "../requests/types.gen";
import * as Common from "./common";
export const useHealthChecksServiceGetHealthLiveSuspense = <
  TData = Common.HealthChecksServiceGetHealthLiveDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseHealthChecksServiceGetHealthLiveKeyFn(queryKey),
    queryFn: () => HealthChecksService.getHealthLive() as TData,
    ...options,
  });
export const useAiProvidersServiceGetApiAiProvidersSuspense = <
  TData = Common.AiProvidersServiceGetApiAiProvidersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAiProvidersServiceGetApiAiProvidersKeyFn(queryKey),
    queryFn: () => AiProvidersService.getApiAiProviders() as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsSuspense = <
  TData = Common.ChatsServiceGetApiChatsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsKeyFn(queryKey),
    queryFn: () => ChatsService.getApiChats() as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsByChatIdSuspense = <
  TData = Common.ChatsServiceGetApiChatsByChatIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    chatId,
  }: {
    chatId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdKeyFn(
      { chatId },
      queryKey,
    ),
    queryFn: () => ChatsService.getApiChatsByChatId({ chatId }) as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsByChatIdMessagesSuspense = <
  TData = Common.ChatsServiceGetApiChatsByChatIdMessagesDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    chatId,
  }: {
    chatId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdMessagesKeyFn(
      { chatId },
      queryKey,
    ),
    queryFn: () =>
      ChatsService.getApiChatsByChatIdMessages({ chatId }) as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersCurrentSuspense = <
  TData = Common.UsersServiceGetApiUsersCurrentDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseUsersServiceGetApiUsersCurrentKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsersCurrent() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminAiModelsSuspense = <
  TData = Common.AdminServiceGetApiAdminAiModelsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminAiModelsKeyFn(queryKey),
    queryFn: () => AdminService.getApiAdminAiModels() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminAiModelsByAiModelIdSuspense = <
  TData = Common.AdminServiceGetApiAdminAiModelsByAiModelIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    aiModelId,
  }: {
    aiModelId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminAiModelsByAiModelIdKeyFn(
      { aiModelId },
      queryKey,
    ),
    queryFn: () =>
      AdminService.getApiAdminAiModelsByAiModelId({ aiModelId }) as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminModelHostsSuspense = <
  TData = Common.AdminServiceGetApiAdminModelHostsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminModelHostsKeyFn(queryKey),
    queryFn: () => AdminService.getApiAdminModelHosts() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminModelHostsByHostIdSuspense = <
  TData = Common.AdminServiceGetApiAdminModelHostsByHostIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    hostId,
  }: {
    hostId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminModelHostsByHostIdKeyFn(
      { hostId },
      queryKey,
    ),
    queryFn: () =>
      AdminService.getApiAdminModelHostsByHostId({ hostId }) as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminBudgetSuspense = <
  TData = Common.AdminServiceGetApiAdminBudgetDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminBudgetKeyFn(queryKey),
    queryFn: () => AdminService.getApiAdminBudget() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminUsageSuspense = <
  TData = Common.AdminServiceGetApiAdminUsageDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
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
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminUsageKeyFn(
      { aggregation, endDate, modelId, startDate, userId },
      queryKey,
    ),
    queryFn: () =>
      AdminService.getApiAdminUsage({
        aggregation,
        endDate,
        modelId,
        startDate,
        userId,
      }) as TData,
    ...options,
  });
export const useAiModelsServiceGetApiAiModelsSuspense = <
  TData = Common.AiModelsServiceGetApiAiModelsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseAiModelsServiceGetApiAiModelsKeyFn(queryKey),
    queryFn: () => AiModelsService.getApiAiModels() as TData,
    ...options,
  });
export const useFilesServiceGetApiFilesByFileIdSuspense = <
  TData = Common.FilesServiceGetApiFilesByFileIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    fileId,
  }: {
    fileId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseFilesServiceGetApiFilesByFileIdKeyFn(
      { fileId },
      queryKey,
    ),
    queryFn: () => FilesService.getApiFilesByFileId({ fileId }) as TData,
    ...options,
  });
export const useUtilizationServiceGetApiUtilizationSuspense = <
  TData = Common.UtilizationServiceGetApiUtilizationDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationKeyFn(queryKey),
    queryFn: () => UtilizationService.getApiUtilization() as TData,
    ...options,
  });
export const useUtilizationServiceGetApiUtilizationLimitsSuspense = <
  TData = Common.UtilizationServiceGetApiUtilizationLimitsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey:
      Common.UseUtilizationServiceGetApiUtilizationLimitsKeyFn(queryKey),
    queryFn: () => UtilizationService.getApiUtilizationLimits() as TData,
    ...options,
  });
