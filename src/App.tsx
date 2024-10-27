import React from 'react';
import MessageList from './components/MessageList';
import useMessages from './hooks/useMessages';

export default function App() {
  const { messages, loading, error, markAsRead } = useMessages();

  if (loading) return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (messages.length === 0) return <div className="p-4 text-center">No messages</div>;

  return (
      <div className="min-w-[400px] min-h-[500px] bg-gray-50 p-4">
          <MessageList/>
      </div>
  );
}