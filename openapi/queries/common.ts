// generated with @7nohe/openapi-react-query-codegen@1.6.2

import type { UseQueryResult } from "@tanstack/react-query";
import type {
  AdminService,
  AiModelsService,
  AiProvidersService,
  AuthenticationService,
  ChatsService,
  FilesService,
  HealthChecksService,
  HostApiKeysService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
import type { AggregationType } from "../requests/types.gen";
export type HealthChecksServiceGetHealthLiveDefaultResponse = Awaited<
  ReturnType<typeof HealthChecksService.getHealthLive>
>;
export type HealthChecksServiceGetHealthLiveQueryResult<
  TData = HealthChecksServiceGetHealthLiveDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useHealthChecksServiceGetHealthLiveKey =
  "HealthChecksServiceGetHealthLive";
export const UseHealthChecksServiceGetHealthLiveKeyFn = (
  queryKey?: Array<unknown>,
) => [useHealthChecksServiceGetHealthLiveKey, ...(queryKey ?? [])];
export type AiProvidersServiceGetApiAiProvidersDefaultResponse = Awaited<
  ReturnType<typeof AiProvidersService.getApiAiProviders>
>;
export type AiProvidersServiceGetApiAiProvidersQueryResult<
  TData = AiProvidersServiceGetApiAiProvidersDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAiProvidersServiceGetApiAiProvidersKey =
  "AiProvidersServiceGetApiAiProviders";
export const UseAiProvidersServiceGetApiAiProvidersKeyFn = (
  queryKey?: Array<unknown>,
) => [useAiProvidersServiceGetApiAiProvidersKey, ...(queryKey ?? [])];
export type ChatsServiceGetApiChatsDefaultResponse = Awaited<
  ReturnType<typeof ChatsService.getApiChats>
>;
export type ChatsServiceGetApiChatsQueryResult<
  TData = ChatsServiceGetApiChatsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useChatsServiceGetApiChatsKey = "ChatsServiceGetApiChats";
export const UseChatsServiceGetApiChatsKeyFn = (queryKey?: Array<unknown>) => [
  useChatsServiceGetApiChatsKey,
  ...(queryKey ?? []),
];
export type ChatsServiceGetApiChatsSharedDefaultResponse = Awaited<
  ReturnType<typeof ChatsService.getApiChatsShared>
>;
export type ChatsServiceGetApiChatsSharedQueryResult<
  TData = ChatsServiceGetApiChatsSharedDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useChatsServiceGetApiChatsSharedKey =
  "ChatsServiceGetApiChatsShared";
export const UseChatsServiceGetApiChatsSharedKeyFn = (
  queryKey?: Array<unknown>,
) => [useChatsServiceGetApiChatsSharedKey, ...(queryKey ?? [])];
export type ChatsServiceGetApiChatsSharedBySharedConversationIdDefaultResponse =
  Awaited<
    ReturnType<typeof ChatsService.getApiChatsSharedBySharedConversationId>
  >;
export type ChatsServiceGetApiChatsSharedBySharedConversationIdQueryResult<
  TData = ChatsServiceGetApiChatsSharedBySharedConversationIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useChatsServiceGetApiChatsSharedBySharedConversationIdKey =
  "ChatsServiceGetApiChatsSharedBySharedConversationId";
export const UseChatsServiceGetApiChatsSharedBySharedConversationIdKeyFn = (
  {
    sharedConversationId,
  }: {
    sharedConversationId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useChatsServiceGetApiChatsSharedBySharedConversationIdKey,
  ...(queryKey ?? [{ sharedConversationId }]),
];
export type ChatsServiceGetApiChatsByChatIdDefaultResponse = Awaited<
  ReturnType<typeof ChatsService.getApiChatsByChatId>
>;
export type ChatsServiceGetApiChatsByChatIdQueryResult<
  TData = ChatsServiceGetApiChatsByChatIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useChatsServiceGetApiChatsByChatIdKey =
  "ChatsServiceGetApiChatsByChatId";
export const UseChatsServiceGetApiChatsByChatIdKeyFn = (
  {
    chatId,
  }: {
    chatId: string;
  },
  queryKey?: Array<unknown>,
) => [useChatsServiceGetApiChatsByChatIdKey, ...(queryKey ?? [{ chatId }])];
export type ChatsServiceGetApiChatsByChatIdMessagesDefaultResponse = Awaited<
  ReturnType<typeof ChatsService.getApiChatsByChatIdMessages>
>;
export type ChatsServiceGetApiChatsByChatIdMessagesQueryResult<
  TData = ChatsServiceGetApiChatsByChatIdMessagesDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useChatsServiceGetApiChatsByChatIdMessagesKey =
  "ChatsServiceGetApiChatsByChatIdMessages";
export const UseChatsServiceGetApiChatsByChatIdMessagesKeyFn = (
  {
    chatId,
  }: {
    chatId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useChatsServiceGetApiChatsByChatIdMessagesKey,
  ...(queryKey ?? [{ chatId }]),
];
export type UsersServiceGetApiUsersCurrentDefaultResponse = Awaited<
  ReturnType<typeof UsersService.getApiUsersCurrent>
>;
export type UsersServiceGetApiUsersCurrentQueryResult<
  TData = UsersServiceGetApiUsersCurrentDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUsersServiceGetApiUsersCurrentKey =
  "UsersServiceGetApiUsersCurrent";
export const UseUsersServiceGetApiUsersCurrentKeyFn = (
  queryKey?: Array<unknown>,
) => [useUsersServiceGetApiUsersCurrentKey, ...(queryKey ?? [])];
export type AdminServiceGetApiAdminAiModelsDefaultResponse = Awaited<
  ReturnType<typeof AdminService.getApiAdminAiModels>
>;
export type AdminServiceGetApiAdminAiModelsQueryResult<
  TData = AdminServiceGetApiAdminAiModelsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAdminServiceGetApiAdminAiModelsKey =
  "AdminServiceGetApiAdminAiModels";
export const UseAdminServiceGetApiAdminAiModelsKeyFn = (
  queryKey?: Array<unknown>,
) => [useAdminServiceGetApiAdminAiModelsKey, ...(queryKey ?? [])];
export type AdminServiceGetApiAdminAiModelsByAiModelIdDefaultResponse = Awaited<
  ReturnType<typeof AdminService.getApiAdminAiModelsByAiModelId>
>;
export type AdminServiceGetApiAdminAiModelsByAiModelIdQueryResult<
  TData = AdminServiceGetApiAdminAiModelsByAiModelIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAdminServiceGetApiAdminAiModelsByAiModelIdKey =
  "AdminServiceGetApiAdminAiModelsByAiModelId";
export const UseAdminServiceGetApiAdminAiModelsByAiModelIdKeyFn = (
  {
    aiModelId,
  }: {
    aiModelId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useAdminServiceGetApiAdminAiModelsByAiModelIdKey,
  ...(queryKey ?? [{ aiModelId }]),
];
export type AdminServiceGetApiAdminModelHostsDefaultResponse = Awaited<
  ReturnType<typeof AdminService.getApiAdminModelHosts>
>;
export type AdminServiceGetApiAdminModelHostsQueryResult<
  TData = AdminServiceGetApiAdminModelHostsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAdminServiceGetApiAdminModelHostsKey =
  "AdminServiceGetApiAdminModelHosts";
export const UseAdminServiceGetApiAdminModelHostsKeyFn = (
  queryKey?: Array<unknown>,
) => [useAdminServiceGetApiAdminModelHostsKey, ...(queryKey ?? [])];
export type AdminServiceGetApiAdminModelHostsByHostIdDefaultResponse = Awaited<
  ReturnType<typeof AdminService.getApiAdminModelHostsByHostId>
>;
export type AdminServiceGetApiAdminModelHostsByHostIdQueryResult<
  TData = AdminServiceGetApiAdminModelHostsByHostIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAdminServiceGetApiAdminModelHostsByHostIdKey =
  "AdminServiceGetApiAdminModelHostsByHostId";
export const UseAdminServiceGetApiAdminModelHostsByHostIdKeyFn = (
  {
    hostId,
  }: {
    hostId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useAdminServiceGetApiAdminModelHostsByHostIdKey,
  ...(queryKey ?? [{ hostId }]),
];
export type AdminServiceGetApiAdminBudgetDefaultResponse = Awaited<
  ReturnType<typeof AdminService.getApiAdminBudget>
>;
export type AdminServiceGetApiAdminBudgetQueryResult<
  TData = AdminServiceGetApiAdminBudgetDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAdminServiceGetApiAdminBudgetKey =
  "AdminServiceGetApiAdminBudget";
export const UseAdminServiceGetApiAdminBudgetKeyFn = (
  queryKey?: Array<unknown>,
) => [useAdminServiceGetApiAdminBudgetKey, ...(queryKey ?? [])];
export type AdminServiceGetApiAdminUsageDefaultResponse = Awaited<
  ReturnType<typeof AdminService.getApiAdminUsage>
>;
export type AdminServiceGetApiAdminUsageQueryResult<
  TData = AdminServiceGetApiAdminUsageDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAdminServiceGetApiAdminUsageKey =
  "AdminServiceGetApiAdminUsage";
export const UseAdminServiceGetApiAdminUsageKeyFn = (
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
  queryKey?: Array<unknown>,
) => [
  useAdminServiceGetApiAdminUsageKey,
  ...(queryKey ?? [{ aggregation, endDate, modelId, startDate, userId }]),
];
export type AiModelsServiceGetApiAiModelsDefaultResponse = Awaited<
  ReturnType<typeof AiModelsService.getApiAiModels>
>;
export type AiModelsServiceGetApiAiModelsQueryResult<
  TData = AiModelsServiceGetApiAiModelsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useAiModelsServiceGetApiAiModelsKey =
  "AiModelsServiceGetApiAiModels";
export const UseAiModelsServiceGetApiAiModelsKeyFn = (
  queryKey?: Array<unknown>,
) => [useAiModelsServiceGetApiAiModelsKey, ...(queryKey ?? [])];
export type FilesServiceGetApiFilesByFileIdDefaultResponse = Awaited<
  ReturnType<typeof FilesService.getApiFilesByFileId>
>;
export type FilesServiceGetApiFilesByFileIdQueryResult<
  TData = FilesServiceGetApiFilesByFileIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useFilesServiceGetApiFilesByFileIdKey =
  "FilesServiceGetApiFilesByFileId";
export const UseFilesServiceGetApiFilesByFileIdKeyFn = (
  {
    fileId,
  }: {
    fileId: string;
  },
  queryKey?: Array<unknown>,
) => [useFilesServiceGetApiFilesByFileIdKey, ...(queryKey ?? [{ fileId }])];
export type HostApiKeysServiceGetApiHostApiKeysDefaultResponse = Awaited<
  ReturnType<typeof HostApiKeysService.getApiHostApiKeys>
>;
export type HostApiKeysServiceGetApiHostApiKeysQueryResult<
  TData = HostApiKeysServiceGetApiHostApiKeysDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useHostApiKeysServiceGetApiHostApiKeysKey =
  "HostApiKeysServiceGetApiHostApiKeys";
export const UseHostApiKeysServiceGetApiHostApiKeysKeyFn = (
  {
    hostId,
  }: {
    hostId?: string;
  } = {},
  queryKey?: Array<unknown>,
) => [useHostApiKeysServiceGetApiHostApiKeysKey, ...(queryKey ?? [{ hostId }])];
export type HostApiKeysServiceGetApiHostApiKeysByKeyIdDefaultResponse = Awaited<
  ReturnType<typeof HostApiKeysService.getApiHostApiKeysByKeyId>
>;
export type HostApiKeysServiceGetApiHostApiKeysByKeyIdQueryResult<
  TData = HostApiKeysServiceGetApiHostApiKeysByKeyIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useHostApiKeysServiceGetApiHostApiKeysByKeyIdKey =
  "HostApiKeysServiceGetApiHostApiKeysByKeyId";
export const UseHostApiKeysServiceGetApiHostApiKeysByKeyIdKeyFn = (
  {
    keyId,
  }: {
    keyId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useHostApiKeysServiceGetApiHostApiKeysByKeyIdKey,
  ...(queryKey ?? [{ keyId }]),
];
export type UtilizationServiceGetApiUtilizationDefaultResponse = Awaited<
  ReturnType<typeof UtilizationService.getApiUtilization>
>;
export type UtilizationServiceGetApiUtilizationQueryResult<
  TData = UtilizationServiceGetApiUtilizationDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUtilizationServiceGetApiUtilizationKey =
  "UtilizationServiceGetApiUtilization";
export const UseUtilizationServiceGetApiUtilizationKeyFn = (
  queryKey?: Array<unknown>,
) => [useUtilizationServiceGetApiUtilizationKey, ...(queryKey ?? [])];
export type UtilizationServiceGetApiUtilizationLimitsDefaultResponse = Awaited<
  ReturnType<typeof UtilizationService.getApiUtilizationLimits>
>;
export type UtilizationServiceGetApiUtilizationLimitsQueryResult<
  TData = UtilizationServiceGetApiUtilizationLimitsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUtilizationServiceGetApiUtilizationLimitsKey =
  "UtilizationServiceGetApiUtilizationLimits";
export const UseUtilizationServiceGetApiUtilizationLimitsKeyFn = (
  queryKey?: Array<unknown>,
) => [useUtilizationServiceGetApiUtilizationLimitsKey, ...(queryKey ?? [])];
export type ChatsServicePostApiChatsMutationResult = Awaited<
  ReturnType<typeof ChatsService.postApiChats>
>;
export type ChatsServicePostApiChatsConversationMutationResult = Awaited<
  ReturnType<typeof ChatsService.postApiChatsConversation>
>;
export type ChatsServicePostApiChatsByChatIdShareMutationResult = Awaited<
  ReturnType<typeof ChatsService.postApiChatsByChatIdShare>
>;
export type AuthenticationServicePostApiAuthGoogleMutationResult = Awaited<
  ReturnType<typeof AuthenticationService.postApiAuthGoogle>
>;
export type AdminServicePostApiAdminAiModelsMutationResult = Awaited<
  ReturnType<typeof AdminService.postApiAdminAiModels>
>;
export type AdminServicePostApiAdminModelHostsMutationResult = Awaited<
  ReturnType<typeof AdminService.postApiAdminModelHosts>
>;
export type AdminServicePostApiAdminMessagesMutationResult = Awaited<
  ReturnType<typeof AdminService.postApiAdminMessages>
>;
export type AdminServicePostApiAdminMessagesStreamMutationResult = Awaited<
  ReturnType<typeof AdminService.postApiAdminMessagesStream>
>;
export type AdminServicePostApiAdminToolsWebSearchMutationResult = Awaited<
  ReturnType<typeof AdminService.postApiAdminToolsWebSearch>
>;
export type FilesServicePostApiFilesUploadMutationResult = Awaited<
  ReturnType<typeof FilesService.postApiFilesUpload>
>;
export type HostApiKeysServicePostApiHostApiKeysMutationResult = Awaited<
  ReturnType<typeof HostApiKeysService.postApiHostApiKeys>
>;
export type AdminServicePutApiAdminAiModelsByAiModelIdMutationResult = Awaited<
  ReturnType<typeof AdminService.putApiAdminAiModelsByAiModelId>
>;
export type AdminServicePutApiAdminModelHostsByHostIdMutationResult = Awaited<
  ReturnType<typeof AdminService.putApiAdminModelHostsByHostId>
>;
export type HostApiKeysServicePutApiHostApiKeysByKeyIdMutationResult = Awaited<
  ReturnType<typeof HostApiKeysService.putApiHostApiKeysByKeyId>
>;
export type ChatsServicePatchApiChatsByChatIdTitleMutationResult = Awaited<
  ReturnType<typeof ChatsService.patchApiChatsByChatIdTitle>
>;
export type ChatsServicePatchApiChatsByChatIdPinMutationResult = Awaited<
  ReturnType<typeof ChatsService.patchApiChatsByChatIdPin>
>;
export type ChatsServicePatchApiChatsByChatIdMessagesByMessageIdSelectMutationResult =
  Awaited<
    ReturnType<
      typeof ChatsService.patchApiChatsByChatIdMessagesByMessageIdSelect
    >
  >;
export type ChatsServiceDeleteApiChatsMutationResult = Awaited<
  ReturnType<typeof ChatsService.deleteApiChats>
>;
export type ChatsServiceDeleteApiChatsShareMutationResult = Awaited<
  ReturnType<typeof ChatsService.deleteApiChatsShare>
>;
export type AdminServiceDeleteApiAdminAiModelsByAiModelIdMutationResult =
  Awaited<ReturnType<typeof AdminService.deleteApiAdminAiModelsByAiModelId>>;
export type AdminServiceDeleteApiAdminModelHostsByHostIdMutationResult =
  Awaited<ReturnType<typeof AdminService.deleteApiAdminModelHostsByHostId>>;
export type HostApiKeysServiceDeleteApiHostApiKeysByKeyIdMutationResult =
  Awaited<ReturnType<typeof HostApiKeysService.deleteApiHostApiKeysByKeyId>>;
