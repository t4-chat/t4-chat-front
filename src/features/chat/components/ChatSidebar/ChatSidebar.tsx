import { useState, useEffect } from 'react';
import { ReactComponent as MenuIcon } from 'src/assets/icons/chats/menu.svg';
import { ReactComponent as SearchIcon } from 'src/assets/icons/chats/search.svg';
import { ReactComponent as NewChatIcon } from 'src/assets/icons/chats/new-chat.svg';
import { ReactComponent as TrashIcon } from 'src/assets/icons/chats/trash.svg';
import { ReactComponent as MoreIcon } from 'src/assets/icons/chats/more.svg';
import { ReactComponent as PinIcon } from 'src/assets/icons/chats/pin.svg';
import { ReactComponent as RenameIcon } from 'src/assets/icons/chats/rename.svg';
import { DropdownMenu } from 'src/components/ui-kit';
import './ChatSidebar.scss';
import { Chat } from 'src/features/chat/types';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats?: Chat[];
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, currentTitle: string) => void;
  onPinChat?: (chatId: string, pinned: boolean) => void;
  activeChat?: string | null;
  isLoading?: boolean;
}

export const ChatSidebar = ({
  isOpen,
  onToggle,
  chats = [],
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  activeChat,
  isLoading = false
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Ensure dates are Date objects and sort by updated_at descending
      const chatsWithDateObjects = chats.map(chat => ({
        ...chat,
        created_at: chat.created_at instanceof Date ? chat.created_at : new Date(chat.created_at),
        updated_at: chat.updated_at instanceof Date ? chat.updated_at : new Date(chat.updated_at)
      }))
      .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
      
      setFilteredChats(chatsWithDateObjects);
    } else {
      const filtered = chats
        .map(chat => ({
          ...chat,
          created_at: chat.created_at instanceof Date ? chat.created_at : new Date(chat.created_at),
          updated_at: chat.updated_at instanceof Date ? chat.updated_at : new Date(chat.updated_at)
        }))
        .filter(chat => 
          chat.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
        
      setFilteredChats(filtered);
    }
  }, [searchTerm, chats]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const dayInMs = 86400000;
    
    if (diff < dayInMs) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < dayInMs * 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Split chats into pinned and unpinned
  const pinnedChats = filteredChats.filter(chat => chat.pinned);
  const unpinnedChats = filteredChats.filter(chat => !chat.pinned);

  return (
    <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="toggle-button" 
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <MenuIcon width={24} height={24} />
        </button>
        <h2 className="sidebar-title">Chats</h2>
        <button 
          className="new-chat-button" 
          onClick={onNewChat}
          aria-label="New chat"
        >
          <NewChatIcon width={20} height={20} />
        </button>
      </div>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <SearchIcon width={16} height={16} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="chats-list">
        {isLoading ? (
          <div className="loading-state">
            <p>Loading chats...</p>
          </div>
        ) : (
          <>
            {filteredChats.length === 0 && (
              <div className="no-chats">
                <p>{searchTerm ? 'No chats found' : 'No recent chats'}</p>
              </div>
            )}
            
            {/* Pinned chats section */}
            {pinnedChats.length > 0 && (
              <div className="chat-section">
                <h3 className="section-title">Pinned</h3>
                {pinnedChats.map(chat => (
                  <ChatListItem 
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onSelect={() => onChatSelect?.(chat.id)}
                    onDelete={() => onDeleteChat?.(chat.id)}
                    onRename={() => onRenameChat?.(chat.id, chat.title)}
                    onTogglePin={() => onPinChat?.(chat.id, !chat.pinned)}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
            
            {/* Other chats section */}
            {unpinnedChats.length > 0 && (
              <div className="chat-section">
                <h3 className="section-title">All chats</h3>
                {unpinnedChats.map(chat => (
                  <ChatListItem 
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onSelect={() => onChatSelect?.(chat.id)}
                    onDelete={() => onDeleteChat?.(chat.id)}
                    onRename={() => onRenameChat?.(chat.id, chat.title)}
                    onTogglePin={() => onPinChat?.(chat.id, !chat.pinned)}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ChatListItem component to keep the main component cleaner
interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: () => void;
  onTogglePin: () => void;
  formatDate: (date: Date) => string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onTogglePin,
  formatDate
}) => {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onSelect}
    >
      <div className="chat-item-title">
        {chat.pinned && <PinIcon className="pin-icon" width={14} height={14} />}
        {chat.title}
      </div>
      
      <DropdownMenu
        className="chat-item-menu"
        trigger={<MoreIcon width={16} height={16} />}
        position="left"
        items={[
          {
            id: 'pin',
            label: chat.pinned ? 'Unpin' : 'Pin',
            icon: <PinIcon width={16} height={16} />,
            onClick: onTogglePin
          },
          {
            id: 'rename',
            label: 'Rename',
            icon: <RenameIcon width={16} height={16} />,
            onClick: onRename
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <TrashIcon width={16} height={16} />,
            onClick: onDelete,
            isDanger: true
          }
        ]}
      />
    </div>
  );
}; 