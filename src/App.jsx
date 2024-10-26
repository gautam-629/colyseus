
// src/App.js
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { ConversationList } from './components/ConversationList';
import { MessageList } from './components/MessageList';
import { useChat } from './hooks/useChat';

const ChatContainer = () => {
  const { user } = useAuth();
  const {
    messages,
    conversations,
    activeConversation,
    fetchConversations,
    selectConversation,
    sendMessage
  } = useChat();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="flex h-screen">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={selectConversation}
        onConversationCreate={(conv) => {
          fetchConversations();
          selectConversation(conv);
        }}
      />
      {activeConversation ? (
        <MessageList
          messages={messages}
          onSendMessage={sendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ChatContainer />
    </AuthProvider>
  );
};

export default App;