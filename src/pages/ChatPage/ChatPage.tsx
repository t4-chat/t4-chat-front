import { useState, useEffect, useRef } from 'react';
import { Chat } from 'src/features/chat/components/Chat';
import { ChatSidebar } from 'src/features/chat/components/ChatSidebar';
import { ChatSidebarToggle } from 'src/features/chat/components/ChatSidebarToggle';
import { ChatSidebarBackdrop } from 'src/features/chat/components/ChatSidebarBackdrop';
import { ChatService } from 'src/features/chat/services/chatService';
import { Chat as ChatType } from 'src/features/chat/types';
import { ConfirmationModal, TextInputModal } from 'src/components/ui-kit';
import './ChatPage.scss';

export const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Chat action modals
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; chatId: string | null }>({
    isOpen: false, 
    chatId: null
  });
  const [renameModalState, setRenameModalState] = useState<{ 
    isOpen: boolean; 
    chatId: string | null;
    currentTitle: string;
  }>({
    isOpen: false, 
    chatId: null,
    currentTitle: ''
  });
  
  const chatServiceRef = useRef(new ChatService());
  
  useEffect(() => {
    loadChats();
  }, []);
  
  const loadChats = async () => {
    try {
      setIsLoading(true);
      const userChats = await chatServiceRef.current.getChats();
      setChats(userChats);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load chats:', error);
      setIsLoading(false);
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleChatSelect = async (chatId: string) => {
    setActiveChatId(chatId);
    
    // On mobile, close the sidebar after selection
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };
  
  const handleNewChat = () => {
    setActiveChatId(null);
    
    // On mobile, close the sidebar after creating a new chat
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };
  
  const handleDeleteModal = (chatId: string) => {
    setDeleteModalState({ isOpen: true, chatId });
  };
  
  const handleRenameModal = (chatId: string, currentTitle: string) => {
    setRenameModalState({ isOpen: true, chatId, currentTitle });
  };
  
  const handleDeleteChat = async () => {
    try {
      if (deleteModalState.chatId) {
        await chatServiceRef.current.deleteChat(deleteModalState.chatId);
        // If the deleted chat is the active one, clear the active chat
        if (activeChatId === deleteModalState.chatId) {
          setActiveChatId(null);
        }
        // Refresh the chats list
        await loadChats();
      }
      setDeleteModalState({ isOpen: false, chatId: null });
    } catch (error) {
      console.error('Failed to delete chat:', error);
      setDeleteModalState({ isOpen: false, chatId: null });
    }
  };
  
  const handleRenameChat = async (newTitle: string) => {
    try {
      if (renameModalState.chatId) {
        await chatServiceRef.current.updateChatTitle(renameModalState.chatId, newTitle);
        // Refresh the chats list
        await loadChats();
      }
      setRenameModalState({ isOpen: false, chatId: null, currentTitle: '' });
    } catch (error) {
      console.error('Failed to rename chat:', error);
      setRenameModalState({ isOpen: false, chatId: null, currentTitle: '' });
    }
  };
  
  const handlePinChat = async (chatId: string, pinned: boolean) => {
    try {
      await chatServiceRef.current.pinChat(chatId, pinned);
      // Refresh the chats list
      await loadChats();
    } catch (error) {
      console.error('Failed to pin/unpin chat:', error);
    }
  };
  
  // Add keyboard support to close sidebar with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);
  
  return (
    <div className={`chat-page ${isSidebarOpen ? 'with-sidebar' : ''}`}>
      <ChatSidebar 
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chats={chats}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        activeChat={activeChatId}
        onDeleteChat={handleDeleteModal}
        onRenameChat={handleRenameModal}
        onPinChat={handlePinChat}
        isLoading={isLoading}
      />
      
      <ChatSidebarToggle 
        onClick={toggleSidebar}
        isVisible={!isSidebarOpen}
      />
      
      <ChatSidebarBackdrop
        isVisible={isSidebarOpen}
        onClick={toggleSidebar}
      />
      
      <div className="chat-container">
        <Chat 
          chatId={activeChatId}
          onChatCreated={(newChatId) => {
            setActiveChatId(newChatId);
            loadChats();
          }}
        />
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, chatId: null })}
        onConfirm={handleDeleteChat}
        title="Delete chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger={true}
      />

      <TextInputModal
        isOpen={renameModalState.isOpen}
        onClose={() => setRenameModalState({ isOpen: false, chatId: null, currentTitle: '' })}
        onSave={handleRenameChat}
        title="Rename chat"
        initialValue={renameModalState.currentTitle}
        placeholder="Enter a new name for this chat"
        saveLabel="Save"
        cancelLabel="Cancel"
        maxLength={50}
        validator={(value) => value.trim().length > 0 && value.trim().length <= 50}
        errorMessage="Chat name must be between 1 and 50 characters"
      />
    </div>
  );
}; 