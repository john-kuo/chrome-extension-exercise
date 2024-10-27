import React from 'react';
import useMessages  from '../hooks/useMessages';

export default function MessageList() {
    const { messages, loading, error, markAsRead } = useMessages();

    if (loading) return <div className="p-4 text-center">Loading messages...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    if (messages.length === 0) return <div className="p-4 text-center">No messages</div>;

    return (
        <div className="w-[400px] h-[500px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Organization Messages</h1>
                <div className="h-[400px] overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className="mb-4 p-3 bg-gray-100 rounded-lg shadow">
                            <p className="text-sm text-gray-600 mb-1">{new Date(message.timestamp).toLocaleString()}</p>
                            <p className="mb-2 text-gray-800">{message.content}</p>
                            <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${message.priority === 'high' ? 'text-red-500' : 'text-blue-500'}`}>
                  {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)} Priority
                </span>
                                {!message.read && (
                                    <button
                                        onClick={() => markAsRead(message.id)}
                                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}