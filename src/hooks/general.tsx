import { useEffect } from "react";

// Global registry to manage hotkey handlers with priorities
const hotkeyRegistry: Record<
  string,
  Array<{ callback: () => void; priority: number; id: string }>
> = {};
const hotkeyListeners: Record<string, (e: KeyboardEvent) => void> = {};

export const useHotkey = (key: string, callback: () => void, priority = 0) => {
  useEffect(() => {
    const id = Math.random().toString(36).substr(2, 9);

    // Initialize registry for this key if it doesn't exist
    if (!hotkeyRegistry[key]) {
      hotkeyRegistry[key] = [];
    }

    // Add the handler
    hotkeyRegistry[key].push({ callback, priority, id });

    // Sort by priority (higher first)
    hotkeyRegistry[key].sort((a, b) => b.priority - a.priority);

    // Create or update the global listener for this key
    if (!hotkeyListeners[key]) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === key &&
          hotkeyRegistry[key] &&
          hotkeyRegistry[key].length > 0
        ) {
          // Execute only the highest priority handler
          const highestPriorityHandler = hotkeyRegistry[key][0];
          highestPriorityHandler.callback();
        }
      };

      hotkeyListeners[key] = handleKeyDown;
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      // Remove this specific handler
      if (hotkeyRegistry[key]) {
        hotkeyRegistry[key] = hotkeyRegistry[key].filter((h) => h.id !== id);

        // If no more handlers, remove the global listener
        if (hotkeyRegistry[key].length === 0) {
          const handler = hotkeyListeners[key];
          if (handler) {
            window.removeEventListener("keydown", handler);
            delete hotkeyListeners[key];
          }
          delete hotkeyRegistry[key];
        } else {
          // Re-sort remaining handlers
          hotkeyRegistry[key].sort((a, b) => b.priority - a.priority);
        }
      }
    };
  }, [key, callback, priority]);
};
