// generated with @7nohe/openapi-react-query-codegen@1.6.2

import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  AiModelsService,
  AiProvidersService,
  AuthenticationService,
  ChatsService,
  FilesService,
  HealthService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
import type {
  Body_upload_file_api_files_upload_post,
  ChatCompletionRequestSchema,
  GoogleAuthRequestSchema,
  UpdateChatTitleRequestSchema,
} from "../requests/types.gen";
import * as Common from "./common";
export const useHealthServiceGetHealthLive = <
  TData = Common.HealthServiceGetHealthLiveDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseHealthServiceGetHealthLiveKeyFn(queryKey),
    queryFn: () => HealthService.getHealthLive() as TData,
    ...options,
  });
export const useAiProvidersServiceGetApiAiProviders = <
  TData = Common.AiProvidersServiceGetApiAiProvidersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAiProvidersServiceGetApiAiProvidersKeyFn(queryKey),
    queryFn: () => AiProvidersService.getApiAiProviders() as TData,
    ...options,
  });
export const useChatsServiceGetApiChats = <
  TData = Common.ChatsServiceGetApiChatsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsKeyFn(queryKey),
    queryFn: () => ChatsService.getApiChats() as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsByChatId = <
  TData = Common.ChatsServiceGetApiChatsByChatIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  {
    chatId,
  }: {
    chatId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdKeyFn(
      { chatId },
      queryKey
    ),
    queryFn: () => ChatsService.getApiChatsByChatId({ chatId }) as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsByChatIdMessages = <
  TData = Common.ChatsServiceGetApiChatsByChatIdMessagesDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  {
    chatId,
  }: {
    chatId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdMessagesKeyFn(
      { chatId },
      queryKey
    ),
    queryFn: () =>
      ChatsService.getApiChatsByChatIdMessages({ chatId }) as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersCurrent = <
  TData = Common.UsersServiceGetApiUsersCurrentDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUsersServiceGetApiUsersCurrentKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsersCurrent() as TData,
    ...options,
  });
export const useAiModelsServiceGetApiAiModels = <
  TData = Common.AiModelsServiceGetApiAiModelsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAiModelsServiceGetApiAiModelsKeyFn(queryKey),
    queryFn: () => AiModelsService.getApiAiModels() as TData,
    ...options,
  });
export const useFilesServiceGetApiFilesByFileId = <
  TData = Common.FilesServiceGetApiFilesByFileIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  {
    fileId,
  }: {
    fileId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseFilesServiceGetApiFilesByFileIdKeyFn(
      { fileId },
      queryKey
    ),
    queryFn: () => FilesService.getApiFilesByFileId({ fileId }) as TData,
    ...options,
  });
export const useUtilizationServiceGetApiUtilization = <
  TData = Common.UtilizationServiceGetApiUtilizationDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationKeyFn(queryKey),
    queryFn: () => UtilizationService.getApiUtilization() as TData,
    ...options,
  });
export const useUtilizationServiceGetApiUtilizationLimits = <
  TData = Common.UtilizationServiceGetApiUtilizationLimitsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) =>
  useQuery<TData, TError>({
    queryKey:
      Common.UseUtilizationServiceGetApiUtilizationLimitsKeyFn(queryKey),
    queryFn: () => UtilizationService.getApiUtilizationLimits() as TData,
    ...options,
  });
export const useChatsServicePostApiChats = <
  TData = Common.ChatsServicePostApiChatsMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<TData, TError, void, TContext>,
    "mutationFn"
  >
) =>
  useMutation<TData, TError, void, TContext>({
    mutationFn: () => ChatsService.postApiChats() as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServicePostApiChatsConversation = <
  TData = Common.ChatsServicePostApiChatsConversationMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody: ChatCompletionRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody: ChatCompletionRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ requestBody }) =>
      ChatsService.postApiChatsConversation({
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useAuthenticationServicePostApiAuthGoogle = <
  TData = Common.AuthenticationServicePostApiAuthGoogleMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody: GoogleAuthRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody: GoogleAuthRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ requestBody }) =>
      AuthenticationService.postApiAuthGoogle({
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useFilesServicePostApiFilesUpload = <
  TData = Common.FilesServicePostApiFilesUploadMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        formData: Body_upload_file_api_files_upload_post;
      },
      TContext
    >,
    "mutationFn"
  >
) =>
  useMutation<
    TData,
    TError,
    {
      formData: Body_upload_file_api_files_upload_post;
    },
    TContext
  >({
    mutationFn: ({ formData }) =>
      FilesService.postApiFilesUpload({
        formData,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServicePatchApiChatsByChatIdTitle = <
  TData = Common.ChatsServicePatchApiChatsByChatIdTitleMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        chatId: string;
        requestBody: UpdateChatTitleRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >
) =>
  useMutation<
    TData,
    TError,
    {
      chatId: string;
      requestBody: UpdateChatTitleRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ chatId, requestBody }) =>
      ChatsService.patchApiChatsByChatIdTitle({
        chatId,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServicePatchApiChatsByChatIdPin = <
  TData = Common.ChatsServicePatchApiChatsByChatIdPinMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        chatId: string;
      },
      TContext
    >,
    "mutationFn"
  >
) =>
  useMutation<
    TData,
    TError,
    {
      chatId: string;
    },
    TContext
  >({
    mutationFn: ({ chatId }) =>
      ChatsService.patchApiChatsByChatIdPin({
        chatId,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServiceDeleteApiChatsByChatId = <
  TData = Common.ChatsServiceDeleteApiChatsByChatIdMutationResult,
  TError = unknown,
  TContext = unknown
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        chatId: string;
      },
      TContext
    >,
    "mutationFn"
  >
) =>
  useMutation<
    TData,
    TError,
    {
      chatId: string;
    },
    TContext
  >({
    mutationFn: ({ chatId }) =>
      ChatsService.deleteApiChatsByChatId({
        chatId,
      }) as unknown as Promise<TData>,
    ...options,
  });
