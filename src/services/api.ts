import { Message, MessagesResponse, isValidMessage } from '@/types/types';

export async function fetchMessages(): Promise<MessagesResponse> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('messages', (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else if (result.messages) {
                // Validate messages before returning
                const validMessages = result.messages.filter(isValidMessage);
                if (validMessages.length !== result.messages.length) {
                    console.warn('Some messages were filtered out due to invalid format');
                }
                resolve({ messages: validMessages });
            } else {
                resolve({ messages: [] });
            }
        });
    });
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'markAsRead', messageId }, (response) => {
            resolve(response.success);
        });
    });
}