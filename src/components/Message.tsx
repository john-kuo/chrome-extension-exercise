import React from 'react';
import { Message as MessageType } from '../types/types';

interface MessageProps {
    message: MessageType;
    onMarkAsRead: (id: string) => void;
}

export default function Message({ message, onMarkAsRead }: MessageProps) {
    const handleMarkAsRead = () => {
        onMarkAsRead(message.id);
    };

    const getPriorityStyles = (priority: MessageType['priority']) => {
        switch (priority) {
            case 'high':
                return !message.read ? 'border-l-4 border-red-500' : 'border-l-4 border-gray-300';
            case 'medium':
                return !message.read ? 'border-l-4 border-yellow-500' : 'border-l-4 border-gray-300';
            case 'low':
                return !message.read ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300';
        }
    };

    return (
        <li className={`p-3 rounded ${message.read ? 'bg-gray-200' : 'bg-white'} ${getPriorityStyles(message.priority)}`}>
            <div className="flex items-center">
                {message.priority === 'high' && !message.read && (
                    <span className="inline-block w-2 h-2 mr-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <p className="mb-2 flex-grow">{message.content}</p>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span className={`font-medium ${
                    message.priority === 'high' ? 'text-red-500' :
                        message.priority === 'medium' ? 'text-yellow-600' :
                            'text-green-500'
                }`}>
                    Priority: {message.priority}
                </span>
                <span>{new Date(message.timestamp).toLocaleString()}</span>
            </div>
            {!message.read && (
                <button
                    onClick={handleMarkAsRead}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Mark as Read
                </button>
            )}
        </li>
    );
}