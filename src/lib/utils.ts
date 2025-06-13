import type { ChatMessageWithDate } from "@/features/chat/components/Pane/Pane";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const responseWasSelected = (
  messages: Pick<
    ChatMessageWithDate,
    "id" | "role" | "previous_message_id" | "selected"
  >[],
) => {
  if (!messages) return true;
  const lastUserMessage = [...messages].findLast((m) => m.role === "user");

  if (!lastUserMessage?.id) return true;

  const responses = messages.filter(
    (m) =>
      m.previous_message_id === lastUserMessage.id && m.role === "assistant",
  );
  if (responses.length > 1) {
    return responses.some((r) => r.selected === true);
  }

  return true;
};
