import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMessages, markMessageAsRead } from '@/services/api';
import { Message } from '@/types/types';
import { SoundManager } from '@/utils/sound';

export default function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const previousMessagesRef = useRef<Message[]>([]);

    const checkForNewHighPriorityMessages = (newMessages: Message[], previousMessages: Message[]) => {
        const previousIds = new Set(previousMessages.map(msg => msg.id));
        const newHighPriorityMessages = newMessages.filter(
            msg => !previousIds.has(msg.id) && msg.priority === 'high' && !msg.read
        );

        if (newHighPriorityMessages.length > 0) {
            SoundManager.getInstance().playNotification();
        }
    };

    const fetchMessagesData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchMessages();
            checkForNewHighPriorityMessages(response.messages, previousMessagesRef.current);
            setMessages(response.messages);
            previousMessagesRef.current = response.messages;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const success = await markMessageAsRead(id);
            if (success) {
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === id ? { ...msg, read: true } : msg
                    )
                );
            } else {
                setError('Failed to mark message as read');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark message as read');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Set up periodic polling for new messages
    useEffect(() => {
        fetchMessagesData();
        const intervalId = setInterval(fetchMessagesData, 30000); // Poll every 30 seconds

        return () => clearInterval(intervalId);
    }, [fetchMessagesData]);

    return {
        messages,
        loading,
        error,
        markAsRead,
        clearError,
        fetchMessagesData
    };
}