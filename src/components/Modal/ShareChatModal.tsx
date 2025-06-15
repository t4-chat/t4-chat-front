import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trash2 } from "lucide-react";
import { useMutationErrorHandler } from "@/hooks/useMutationErrorHandler";
import {
  useChatsServicePostApiChatsByChatIdShare,
  useChatsServiceDeleteApiChatsShare,
} from "~/openapi/queries/queries";
import { useQueryClient } from "@tanstack/react-query";
import { UseChatsServiceGetApiChatsKeyFn } from "~/openapi/queries/common";
import Modal from "./Modal";

interface ShareChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  existingSharedConversationId?: string | null;
}

const ShareChatModal = ({
  isOpen,
  onClose,
  chatId,
  existingSharedConversationId,
}: ShareChatModalProps) => {
  const [sharedConversationId, setSharedConversationId] = useState<
    string | null
  >(existingSharedConversationId || null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const { handleError, handleSuccess } = useMutationErrorHandler();
  const queryClient = useQueryClient();

  const { mutateAsync: shareChat, isPending: isSharing } =
    useChatsServicePostApiChatsByChatIdShare({
      onSuccess: (data) => {
        setSharedConversationId(data.shared_conversation_id);
        queryClient.invalidateQueries({
          queryKey: UseChatsServiceGetApiChatsKeyFn(),
        });
        handleSuccess("Share link created successfully");
      },
      onError: (error) => handleError(error, "Failed to create share link"),
    });

  const { mutateAsync: unshareChat, isPending: isUnsharing } =
    useChatsServiceDeleteApiChatsShare({
      onSuccess: () => {
        setSharedConversationId(null);
        queryClient.invalidateQueries({
          queryKey: UseChatsServiceGetApiChatsKeyFn(),
        });
        handleSuccess("Chat unshared successfully");
      },
      onError: (error) => handleError(error, "Failed to unshare chat"),
    });

  const handleCreateShareLink = async () => {
    try {
      await shareChat({ chatId });
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };

  const handleUnshareChat = async () => {
    if (!sharedConversationId) return;

    try {
      await unshareChat({
        requestBody: {
          shared_conversation_ids: [sharedConversationId],
        },
      });
    } catch (error) {
      console.error("Failed to unshare chat:", error);
    }
  };

  const copyToClipboard = async () => {
    if (!sharedConversationId) return;

    const shareUrl = `${window.location.origin}/share/${sharedConversationId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const shareUrl = sharedConversationId
    ? `${window.location.origin}/share/${sharedConversationId}`
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Chat">
      <div className="space-y-4">
        {!sharedConversationId ? (
          <>
            <p className="text-[var(--text-secondary-color)] text-sm">
              Create a share link to allow others to view this conversation.
              Anyone with the link will be able to see the messages and continue
              the conversation.
            </p>
            <Button
              onClick={handleCreateShareLink}
              disabled={isSharing}
              className="w-full"
            >
              {isSharing ? "Creating..." : "Create Share Link"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-[var(--text-secondary-color)] text-sm">
              Share this link with others to let them view and continue this
              conversation:
            </p>

            <div className="flex items-center gap-2 bg-[var(--hover-color)] p-3 rounded-lg">
              <input
                type="text"
                value={shareUrl || ""}
                readOnly
                className="flex-1 bg-transparent outline-none text-[var(--text-primary-color)] text-sm"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 hover:bg-[var(--primary-color)]/10 px-2 py-1 rounded text-[var(--primary-color)] transition-colors"
              >
                {copyState === "copied" ? (
                  <>
                    <Check size={16} />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                className="flex-1"
              >
                {copyState === "copied" ? "Copied!" : "Copy Link"}
              </Button>
              <Button
                onClick={handleUnshareChat}
                disabled={isUnsharing}
                variant="destructive"
                className="flex items-center gap-1"
              >
                <Trash2 size={16} />
                {isUnsharing ? "Removing..." : "Unshare"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ShareChatModal;
