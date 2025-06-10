// generated with @7nohe/openapi-react-query-codegen@1.6.2

import type { UseQueryResult } from "@tanstack/react-query";
import type {
  AiModelsService,
  AiProvidersService,
  AuthenticationService,
  ChatsService,
  FilesService,
  HealthService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
export type HealthServiceGetHealthLiveDefaultResponse = Awaited<
  ReturnType<typeof HealthService.getHealthLive>
>;
export type HealthServiceGetHealthLiveQueryResult<
  TData = HealthServiceGetHealthLiveDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useHealthServiceGetHealthLiveKey = "HealthServiceGetHealthLive";
export const UseHealthServiceGetHealthLiveKeyFn = (
  queryKey?: Array<unknown>,
) => [useHealthServiceGetHealthLiveKey, ...(queryKey ?? [])];
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
export type AuthenticationServicePostApiAuthGoogleMutationResult = Awaited<
  ReturnType<typeof AuthenticationService.postApiAuthGoogle>
>;
export type FilesServicePostApiFilesUploadMutationResult = Awaited<
  ReturnType<typeof FilesService.postApiFilesUpload>
>;
export type ChatsServicePatchApiChatsByChatIdTitleMutationResult = Awaited<
  ReturnType<typeof ChatsService.patchApiChatsByChatIdTitle>
>;
export type ChatsServicePatchApiChatsByChatIdPinMutationResult = Awaited<
  ReturnType<typeof ChatsService.patchApiChatsByChatIdPin>
>;
export type ChatsServiceDeleteApiChatsByChatIdMutationResult = Awaited<
  ReturnType<typeof ChatsService.deleteApiChatsByChatId>
>;
