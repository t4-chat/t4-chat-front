// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import type {
  GetHealthLiveResponse,
  GetApiAiProvidersResponse,
  GetApiChatsResponse,
  PostApiChatsResponse,
  DeleteApiChatsData,
  DeleteApiChatsResponse,
  PostApiChatsConversationData,
  PostApiChatsConversationResponse,
  GetApiChatsSharedResponse,
  GetApiChatsSharedBySharedConversationIdData,
  GetApiChatsSharedBySharedConversationIdResponse,
  DeleteApiChatsShareData,
  DeleteApiChatsShareResponse,
  GetApiChatsByChatIdData,
  GetApiChatsByChatIdResponse,
  GetApiChatsByChatIdMessagesData,
  GetApiChatsByChatIdMessagesResponse,
  PatchApiChatsByChatIdTitleData,
  PatchApiChatsByChatIdTitleResponse,
  PatchApiChatsByChatIdPinData,
  PatchApiChatsByChatIdPinResponse,
  PatchApiChatsByChatIdMessagesByMessageIdSelectData,
  PatchApiChatsByChatIdMessagesByMessageIdSelectResponse,
  PostApiChatsByChatIdShareData,
  PostApiChatsByChatIdShareResponse,
  PostApiAuthGoogleData,
  PostApiAuthGoogleResponse,
  GetApiUsersCurrentResponse,
  GetApiAdminAiModelsResponse,
  PostApiAdminAiModelsData,
  PostApiAdminAiModelsResponse,
  GetApiAdminAiModelsByAiModelIdData,
  GetApiAdminAiModelsByAiModelIdResponse,
  PutApiAdminAiModelsByAiModelIdData,
  PutApiAdminAiModelsByAiModelIdResponse,
  DeleteApiAdminAiModelsByAiModelIdData,
  DeleteApiAdminAiModelsByAiModelIdResponse,
  GetApiAdminModelHostsResponse,
  PostApiAdminModelHostsData,
  PostApiAdminModelHostsResponse,
  GetApiAdminModelHostsByHostIdData,
  GetApiAdminModelHostsByHostIdResponse,
  PutApiAdminModelHostsByHostIdData,
  PutApiAdminModelHostsByHostIdResponse,
  DeleteApiAdminModelHostsByHostIdData,
  DeleteApiAdminModelHostsByHostIdResponse,
  GetApiAdminBudgetResponse,
  GetApiAdminUsageData,
  GetApiAdminUsageResponse,
  PostApiAdminMessagesData,
  PostApiAdminMessagesResponse,
  PostApiAdminMessagesStreamData,
  PostApiAdminMessagesStreamResponse,
  PostApiAdminToolsWebSearchData,
  PostApiAdminToolsWebSearchResponse,
  GetApiAiModelsResponse,
  PostApiFilesUploadData,
  PostApiFilesUploadResponse,
  GetApiFilesByFileIdData,
  GetApiFilesByFileIdResponse,
  PostApiHostApiKeysData,
  PostApiHostApiKeysResponse,
  GetApiHostApiKeysData,
  GetApiHostApiKeysResponse,
  GetApiHostApiKeysByKeyIdData,
  GetApiHostApiKeysByKeyIdResponse,
  PutApiHostApiKeysByKeyIdData,
  PutApiHostApiKeysByKeyIdResponse,
  DeleteApiHostApiKeysByKeyIdData,
  DeleteApiHostApiKeysByKeyIdResponse,
  GetApiUtilizationResponse,
  GetApiUtilizationLimitsResponse,
} from "./types.gen";

export class HealthChecksService {
  /**
   * Ping
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static getHealthLive(): CancelablePromise<GetHealthLiveResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/health/live",
    });
  }
}

export class AiProvidersService {
  /**
   * Get Ai Providers
   * @returns src__api__schemas__ai_providers__AiProviderResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiAiProviders(): CancelablePromise<GetApiAiProvidersResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/ai-providers",
    });
  }
}

export class ChatsService {
  /**
   * Get Chats
   * @returns ChatListItemResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiChats(): CancelablePromise<GetApiChatsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chats",
    });
  }

  /**
   * Create Chat
   * @returns ChatResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiChats(): CancelablePromise<PostApiChatsResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/chats",
    });
  }

  /**
   * Delete Chats
   * @param data The data for the request.
   * @param data.requestBody
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static deleteApiChats(
    data: DeleteApiChatsData,
  ): CancelablePromise<DeleteApiChatsResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/chats",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Send Message
   * @param data The data for the request.
   * @param data.requestBody
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static postApiChatsConversation(
    data: PostApiChatsConversationData,
  ): CancelablePromise<PostApiChatsConversationResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/chats/conversation",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Shared Chats
   * @returns SharedConversationListItemResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiChatsShared(): CancelablePromise<GetApiChatsSharedResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chats/shared",
    });
  }

  /**
   * Get Shared Chat
   * @param data The data for the request.
   * @param data.sharedConversationId
   * @returns ChatResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiChatsSharedBySharedConversationId(
    data: GetApiChatsSharedBySharedConversationIdData,
  ): CancelablePromise<GetApiChatsSharedBySharedConversationIdResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chats/shared/{shared_conversation_id}",
      path: {
        shared_conversation_id: data.sharedConversationId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Unshare Chats
   * @param data The data for the request.
   * @param data.requestBody
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static deleteApiChatsShare(
    data: DeleteApiChatsShareData,
  ): CancelablePromise<DeleteApiChatsShareResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/chats/share",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Chat
   * @param data The data for the request.
   * @param data.chatId
   * @returns ChatResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiChatsByChatId(
    data: GetApiChatsByChatIdData,
  ): CancelablePromise<GetApiChatsByChatIdResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chats/{chat_id}",
      path: {
        chat_id: data.chatId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Messages
   * @param data The data for the request.
   * @param data.chatId
   * @returns ChatMessagesResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiChatsByChatIdMessages(
    data: GetApiChatsByChatIdMessagesData,
  ): CancelablePromise<GetApiChatsByChatIdMessagesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chats/{chat_id}/messages",
      path: {
        chat_id: data.chatId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Chat Title
   * @param data The data for the request.
   * @param data.chatId
   * @param data.requestBody
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static patchApiChatsByChatIdTitle(
    data: PatchApiChatsByChatIdTitleData,
  ): CancelablePromise<PatchApiChatsByChatIdTitleResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/chats/{chat_id}/title",
      path: {
        chat_id: data.chatId,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Pin Chat
   * @param data The data for the request.
   * @param data.chatId
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static patchApiChatsByChatIdPin(
    data: PatchApiChatsByChatIdPinData,
  ): CancelablePromise<PatchApiChatsByChatIdPinResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/chats/{chat_id}/pin",
      path: {
        chat_id: data.chatId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Select Message
   * @param data The data for the request.
   * @param data.chatId
   * @param data.messageId
   * @returns ChatMessageResponseSchema Successful Response
   * @throws ApiError
   */
  public static patchApiChatsByChatIdMessagesByMessageIdSelect(
    data: PatchApiChatsByChatIdMessagesByMessageIdSelectData,
  ): CancelablePromise<PatchApiChatsByChatIdMessagesByMessageIdSelectResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/chats/{chat_id}/messages/{message_id}/select",
      path: {
        chat_id: data.chatId,
        message_id: data.messageId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Share Chat
   * @param data The data for the request.
   * @param data.chatId
   * @returns ShareChatResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiChatsByChatIdShare(
    data: PostApiChatsByChatIdShareData,
  ): CancelablePromise<PostApiChatsByChatIdShareResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/chats/{chat_id}/share",
      path: {
        chat_id: data.chatId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export class AuthenticationService {
  /**
   * Google Login
   * @param data The data for the request.
   * @param data.requestBody
   * @returns TokenResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiAuthGoogle(
    data: PostApiAuthGoogleData,
  ): CancelablePromise<PostApiAuthGoogleResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/google",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export class UsersService {
  /**
   * Get Current User
   * @returns UserResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiUsersCurrent(): CancelablePromise<GetApiUsersCurrentResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/users/current",
    });
  }
}

export class AdminService {
  /**
   * Get Ai Models
   * @returns AiModelResponseForAdminSchema Successful Response
   * @throws ApiError
   */
  public static getApiAdminAiModels(): CancelablePromise<GetApiAdminAiModelsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/ai-models",
    });
  }

  /**
   * Add Ai Model
   * @param data The data for the request.
   * @param data.requestBody
   * @returns AiModelResponseForAdminSchema Successful Response
   * @throws ApiError
   */
  public static postApiAdminAiModels(
    data: PostApiAdminAiModelsData,
  ): CancelablePromise<PostApiAdminAiModelsResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/admin/ai-models",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Ai Model
   * @param data The data for the request.
   * @param data.aiModelId
   * @returns AiModelResponseForAdminSchema Successful Response
   * @throws ApiError
   */
  public static getApiAdminAiModelsByAiModelId(
    data: GetApiAdminAiModelsByAiModelIdData,
  ): CancelablePromise<GetApiAdminAiModelsByAiModelIdResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/ai-models/{ai_model_id}",
      path: {
        ai_model_id: data.aiModelId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Ai Model
   * @param data The data for the request.
   * @param data.aiModelId
   * @param data.requestBody
   * @returns AiModelResponseForAdminSchema Successful Response
   * @throws ApiError
   */
  public static putApiAdminAiModelsByAiModelId(
    data: PutApiAdminAiModelsByAiModelIdData,
  ): CancelablePromise<PutApiAdminAiModelsByAiModelIdResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/admin/ai-models/{ai_model_id}",
      path: {
        ai_model_id: data.aiModelId,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Ai Model
   * @param data The data for the request.
   * @param data.aiModelId
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static deleteApiAdminAiModelsByAiModelId(
    data: DeleteApiAdminAiModelsByAiModelIdData,
  ): CancelablePromise<DeleteApiAdminAiModelsByAiModelIdResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/admin/ai-models/{ai_model_id}",
      path: {
        ai_model_id: data.aiModelId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Hosts
   * @returns AiModelHostResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiAdminModelHosts(): CancelablePromise<GetApiAdminModelHostsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/model-hosts",
    });
  }

  /**
   * Add Host
   * @param data The data for the request.
   * @param data.requestBody
   * @returns AiModelHostResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiAdminModelHosts(
    data: PostApiAdminModelHostsData,
  ): CancelablePromise<PostApiAdminModelHostsResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/admin/model-hosts",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Host
   * @param data The data for the request.
   * @param data.hostId
   * @returns AiModelHostResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiAdminModelHostsByHostId(
    data: GetApiAdminModelHostsByHostIdData,
  ): CancelablePromise<GetApiAdminModelHostsByHostIdResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/model-hosts/{host_id}",
      path: {
        host_id: data.hostId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Host
   * @param data The data for the request.
   * @param data.hostId
   * @param data.requestBody
   * @returns AiModelHostResponseSchema Successful Response
   * @throws ApiError
   */
  public static putApiAdminModelHostsByHostId(
    data: PutApiAdminModelHostsByHostIdData,
  ): CancelablePromise<PutApiAdminModelHostsByHostIdResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/admin/model-hosts/{host_id}",
      path: {
        host_id: data.hostId,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Host
   * @param data The data for the request.
   * @param data.hostId
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static deleteApiAdminModelHostsByHostId(
    data: DeleteApiAdminModelHostsByHostIdData,
  ): CancelablePromise<DeleteApiAdminModelHostsByHostIdResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/admin/model-hosts/{host_id}",
      path: {
        host_id: data.hostId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Budget
   * @returns BudgetResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiAdminBudget(): CancelablePromise<GetApiAdminBudgetResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/budget",
    });
  }

  /**
   * Get Usage
   * @param data The data for the request.
   * @param data.aggregation How to aggregate the usage data
   * @param data.startDate Start date for filtering
   * @param data.endDate End date for filtering
   * @param data.userId Filter by user ID
   * @param data.modelId Filter by model ID
   * @returns UsageAggregationResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiAdminUsage(
    data: GetApiAdminUsageData = {},
  ): CancelablePromise<GetApiAdminUsageResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/admin/usage",
      query: {
        aggregation: data.aggregation,
        start_date: data.startDate,
        end_date: data.endDate,
        user_id: data.userId,
        model_id: data.modelId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Send Message
   * @param data The data for the request.
   * @param data.requestBody
   * @returns AdminSendMessageResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiAdminMessages(
    data: PostApiAdminMessagesData,
  ): CancelablePromise<PostApiAdminMessagesResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/admin/messages",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Generate Response Stream
   * @param data The data for the request.
   * @param data.requestBody
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static postApiAdminMessagesStream(
    data: PostApiAdminMessagesStreamData,
  ): CancelablePromise<PostApiAdminMessagesStreamResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/admin/messages/stream",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Web Search
   * @param data The data for the request.
   * @param data.query
   * @param data.numResults
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static postApiAdminToolsWebSearch(
    data: PostApiAdminToolsWebSearchData,
  ): CancelablePromise<PostApiAdminToolsWebSearchResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/admin/tools/web-search",
      query: {
        query: data.query,
        num_results: data.numResults,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export class AiModelsService {
  /**
   * Get Ai Models
   * @returns AiModelResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiAiModels(): CancelablePromise<GetApiAiModelsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/ai-models",
    });
  }
}

export class FilesService {
  /**
   * Upload File
   * @param data The data for the request.
   * @param data.formData
   * @returns FileResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiFilesUpload(
    data: PostApiFilesUploadData,
  ): CancelablePromise<PostApiFilesUploadResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/files/upload",
      formData: data.formData,
      mediaType: "multipart/form-data",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get File
   * @param data The data for the request.
   * @param data.fileId
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static getApiFilesByFileId(
    data: GetApiFilesByFileIdData,
  ): CancelablePromise<GetApiFilesByFileIdResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/files/{file_id}",
      path: {
        file_id: data.fileId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export class HostApiKeysService {
  /**
   * Create Host Api Key
   * @param data The data for the request.
   * @param data.requestBody
   * @returns HostApiKeyResponseSchema Successful Response
   * @throws ApiError
   */
  public static postApiHostApiKeys(
    data: PostApiHostApiKeysData,
  ): CancelablePromise<PostApiHostApiKeysResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/host-api-keys",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Host Api Keys
   * @param data The data for the request.
   * @param data.hostId
   * @returns HostApiKeyResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiHostApiKeys(
    data: GetApiHostApiKeysData = {},
  ): CancelablePromise<GetApiHostApiKeysResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/host-api-keys",
      query: {
        host_id: data.hostId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Get Host Api Key
   * @param data The data for the request.
   * @param data.keyId
   * @returns HostApiKeyResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiHostApiKeysByKeyId(
    data: GetApiHostApiKeysByKeyIdData,
  ): CancelablePromise<GetApiHostApiKeysByKeyIdResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/host-api-keys/{key_id}",
      path: {
        key_id: data.keyId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Update Host Api Key
   * @param data The data for the request.
   * @param data.keyId
   * @param data.requestBody
   * @returns HostApiKeyResponseSchema Successful Response
   * @throws ApiError
   */
  public static putApiHostApiKeysByKeyId(
    data: PutApiHostApiKeysByKeyIdData,
  ): CancelablePromise<PutApiHostApiKeysByKeyIdResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/host-api-keys/{key_id}",
      path: {
        key_id: data.keyId,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    });
  }

  /**
   * Delete Host Api Key
   * @param data The data for the request.
   * @param data.keyId
   * @returns unknown Successful Response
   * @throws ApiError
   */
  public static deleteApiHostApiKeysByKeyId(
    data: DeleteApiHostApiKeysByKeyIdData,
  ): CancelablePromise<DeleteApiHostApiKeysByKeyIdResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/host-api-keys/{key_id}",
      path: {
        key_id: data.keyId,
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}

export class UtilizationService {
  /**
   * Get Utilizations
   * @returns UtilizationsResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiUtilization(): CancelablePromise<GetApiUtilizationResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/utilization",
    });
  }

  /**
   * Get Limits
   * @returns LimitsResponseSchema Successful Response
   * @throws ApiError
   */
  public static getApiUtilizationLimits(): CancelablePromise<GetApiUtilizationLimitsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/utilization/limits",
    });
  }
}
