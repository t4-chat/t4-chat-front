import { useFilesServicePostApiFilesUpload } from "~/openapi/queries/queries";
import { ChatService } from "@/services/chatService";
import type { StreamEvent } from "@/utils/apiUtils";
import { useMutationErrorHandler } from "@/hooks/useMutationErrorHandler";

interface UseChatSenderOptions {
  onEvent: (
    event: StreamEvent & { message_id?: string; model_id?: number },
  ) => void;
  onError: (error: unknown) => void;
  onDone: () => void;
}

export const useChatSender = ({
  onEvent,
  onError,
  onDone,
}: UseChatSenderOptions) => {
  const { handleError, handleSuccess } = useMutationErrorHandler();
  const { mutateAsync: upload } = useFilesServicePostApiFilesUpload({
    onSuccess: () => handleSuccess("File uploaded successfully"),
    onError: (error) => handleError(error, "Failed to upload file"),
  });
  const send = async (
    content: string,
    files: File[] | undefined,
    modelIds: string[],
    chatId?: string | null,
    sharedConversationId?: string | null,
  ) => {
    let attachmentIds: string[] = [];
    if (files && files.length > 0) {
      const results = await Promise.all(
        files.map((file) => upload({ formData: { file } })),
      );
      attachmentIds = results.map((r) => r.file_id);
    }

    const abort = new ChatService().streamChat({
      message: {
        content,
        // role: "user",
        attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
        chat_id: chatId || undefined,
      },
      modelIds,
      onEvent,
      onError,
      onDone,
      options: { chatId, sharedConversationId },
    });

    return { abort };
  };

  return { send };
};

export default useChatSender;
