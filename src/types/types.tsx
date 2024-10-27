export interface Message {
    id: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
    timestamp: string;
    read: boolean;
}

export interface MessagesResponse {
    messages: Message[];
}

// Type guard for priority
export function isValidPriority(priority: string): priority is Message['priority'] {
    return ['high', 'medium', 'low'].includes(priority);
}

// Type guard for message
export function isValidMessage(message: any): message is Message {
    return (
        typeof message === 'object' &&
        typeof message.id === 'string' &&
        typeof message.content === 'string' &&
        typeof message.timestamp === 'string' &&
        typeof message.read === 'boolean' &&
        typeof message.priority === 'string' &&
        isValidPriority(message.priority)
    );
}