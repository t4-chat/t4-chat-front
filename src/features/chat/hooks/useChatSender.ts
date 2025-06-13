import { useFilesServicePostApiFilesUpload } from "~/openapi/queries/queries";
import { ChatService } from "@/services/chatService";
import type { StreamEvent } from "@/utils/apiUtils";

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
  const { mutateAsync: upload } = useFilesServicePostApiFilesUpload();
  const send = async (
    content: string,
    files: File[] | undefined,
    modelIds: (number | string)[],
    chatId?: string | null,
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
      options: { chatId },
    });

    return { abort };
  };

  return { send };
};

export default useChatSender;
