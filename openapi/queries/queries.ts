// generated with @7nohe/openapi-react-query-codegen@1.6.2

import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  AdminService,
  AiModelsService,
  AiProvidersService,
  AuthenticationService,
  ChatsService,
  FilesService,
  HealthChecksService,
  UsersService,
  UtilizationService,
} from "../requests/services.gen";
import type {
  AggregationType,
  Body_upload_file_api_files_upload_post,
  DeleteChatsRequestSchema,
  EditAiModelHostRequestSchema,
  EditAiModelRequestSchema,
  GoogleAuthRequestSchema,
  MultiModelCompletionRequestSchema,
  UpdateChatTitleRequestSchema,
} from "../requests/types.gen";
import * as Common from "./common";
export const useHealthChecksServiceGetHealthLive = <
  TData = Common.HealthChecksServiceGetHealthLiveDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseHealthChecksServiceGetHealthLiveKeyFn(queryKey),
    queryFn: () => HealthChecksService.getHealthLive() as TData,
    ...options,
  });
export const useAiProvidersServiceGetApiAiProviders = <
  TData = Common.AiProvidersServiceGetApiAiProvidersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAiProvidersServiceGetApiAiProvidersKeyFn(queryKey),
    queryFn: () => AiProvidersService.getApiAiProviders() as TData,
    ...options,
  });
export const useChatsServiceGetApiChats = <
  TData = Common.ChatsServiceGetApiChatsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsKeyFn(queryKey),
    queryFn: () => ChatsService.getApiChats() as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsByChatId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdKeyFn(
      { chatId },
      queryKey,
    ),
    queryFn: () => ChatsService.getApiChatsByChatId({ chatId }) as TData,
    ...options,
  });
export const useChatsServiceGetApiChatsByChatIdMessages = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseChatsServiceGetApiChatsByChatIdMessagesKeyFn(
      { chatId },
      queryKey,
    ),
    queryFn: () =>
      ChatsService.getApiChatsByChatIdMessages({ chatId }) as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersCurrent = <
  TData = Common.UsersServiceGetApiUsersCurrentDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUsersServiceGetApiUsersCurrentKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsersCurrent() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminAiModels = <
  TData = Common.AdminServiceGetApiAdminAiModelsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminAiModelsKeyFn(queryKey),
    queryFn: () => AdminService.getApiAdminAiModels() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminAiModelsByAiModelId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminAiModelsByAiModelIdKeyFn(
      { aiModelId },
      queryKey,
    ),
    queryFn: () =>
      AdminService.getApiAdminAiModelsByAiModelId({ aiModelId }) as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminModelHosts = <
  TData = Common.AdminServiceGetApiAdminModelHostsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminModelHostsKeyFn(queryKey),
    queryFn: () => AdminService.getApiAdminModelHosts() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminModelHostsByHostId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminModelHostsByHostIdKeyFn(
      { hostId },
      queryKey,
    ),
    queryFn: () =>
      AdminService.getApiAdminModelHostsByHostId({ hostId }) as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminBudget = <
  TData = Common.AdminServiceGetApiAdminBudgetDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAdminServiceGetApiAdminBudgetKeyFn(queryKey),
    queryFn: () => AdminService.getApiAdminBudget() as TData,
    ...options,
  });
export const useAdminServiceGetApiAdminUsage = <
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
  useQuery<TData, TError>({
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
export const useAiModelsServiceGetApiAiModels = <
  TData = Common.AiModelsServiceGetApiAiModelsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseAiModelsServiceGetApiAiModelsKeyFn(queryKey),
    queryFn: () => AiModelsService.getApiAiModels() as TData,
    ...options,
  });
export const useFilesServiceGetApiFilesByFileId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseFilesServiceGetApiFilesByFileIdKeyFn(
      { fileId },
      queryKey,
    ),
    queryFn: () => FilesService.getApiFilesByFileId({ fileId }) as TData,
    ...options,
  });
export const useUtilizationServiceGetApiUtilization = <
  TData = Common.UtilizationServiceGetApiUtilizationDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUtilizationServiceGetApiUtilizationKeyFn(queryKey),
    queryFn: () => UtilizationService.getApiUtilization() as TData,
    ...options,
  });
export const useUtilizationServiceGetApiUtilizationLimits = <
  TData = Common.UtilizationServiceGetApiUtilizationLimitsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
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
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<TData, TError, void, TContext>,
    "mutationFn"
  >,
) =>
  useMutation<TData, TError, void, TContext>({
    mutationFn: () => ChatsService.postApiChats() as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServicePostApiChatsConversation = <
  TData = Common.ChatsServicePostApiChatsConversationMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody: MultiModelCompletionRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody: MultiModelCompletionRequestSchema;
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
  TContext = unknown,
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
  >,
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
export const useAdminServicePostApiAdminAiModels = <
  TData = Common.AdminServicePostApiAdminAiModelsMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody: EditAiModelRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody: EditAiModelRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ requestBody }) =>
      AdminService.postApiAdminAiModels({
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useAdminServicePostApiAdminModelHosts = <
  TData = Common.AdminServicePostApiAdminModelHostsMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody: EditAiModelHostRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody: EditAiModelHostRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ requestBody }) =>
      AdminService.postApiAdminModelHosts({
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useFilesServicePostApiFilesUpload = <
  TData = Common.FilesServicePostApiFilesUploadMutationResult,
  TError = unknown,
  TContext = unknown,
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
  >,
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
export const useAdminServicePutApiAdminAiModelsByAiModelId = <
  TData = Common.AdminServicePutApiAdminAiModelsByAiModelIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        aiModelId: string;
        requestBody: EditAiModelRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      aiModelId: string;
      requestBody: EditAiModelRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ aiModelId, requestBody }) =>
      AdminService.putApiAdminAiModelsByAiModelId({
        aiModelId,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useAdminServicePutApiAdminModelHostsByHostId = <
  TData = Common.AdminServicePutApiAdminModelHostsByHostIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        hostId: string;
        requestBody: EditAiModelHostRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      hostId: string;
      requestBody: EditAiModelHostRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ hostId, requestBody }) =>
      AdminService.putApiAdminModelHostsByHostId({
        hostId,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServicePatchApiChatsByChatIdTitle = <
  TData = Common.ChatsServicePatchApiChatsByChatIdTitleMutationResult,
  TError = unknown,
  TContext = unknown,
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
  >,
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
  TContext = unknown,
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
  >,
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
export const useChatsServicePatchApiChatsByChatIdMessagesByMessageIdSelect = <
  TData = Common.ChatsServicePatchApiChatsByChatIdMessagesByMessageIdSelectMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        chatId: string;
        messageId: string;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      chatId: string;
      messageId: string;
    },
    TContext
  >({
    mutationFn: ({ chatId, messageId }) =>
      ChatsService.patchApiChatsByChatIdMessagesByMessageIdSelect({
        chatId,
        messageId,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useChatsServiceDeleteApiChats = <
  TData = Common.ChatsServiceDeleteApiChatsMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        requestBody: DeleteChatsRequestSchema;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      requestBody: DeleteChatsRequestSchema;
    },
    TContext
  >({
    mutationFn: ({ requestBody }) =>
      ChatsService.deleteApiChats({ requestBody }) as unknown as Promise<TData>,
    ...options,
  });
export const useAdminServiceDeleteApiAdminAiModelsByAiModelId = <
  TData = Common.AdminServiceDeleteApiAdminAiModelsByAiModelIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        aiModelId: string;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      aiModelId: string;
    },
    TContext
  >({
    mutationFn: ({ aiModelId }) =>
      AdminService.deleteApiAdminAiModelsByAiModelId({
        aiModelId,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useAdminServiceDeleteApiAdminModelHostsByHostId = <
  TData = Common.AdminServiceDeleteApiAdminModelHostsByHostIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        hostId: string;
      },
      TContext
    >,
    "mutationFn"
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      hostId: string;
    },
    TContext
  >({
    mutationFn: ({ hostId }) =>
      AdminService.deleteApiAdminModelHostsByHostId({
        hostId,
      }) as unknown as Promise<TData>,
    ...options,
  });
