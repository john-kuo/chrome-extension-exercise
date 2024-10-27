import { fetchMessages, markMessageAsRead } from '../services/api';

// Mock Chrome API
const mockGet = jest.fn();
const mockSendMessage = jest.fn();

global.chrome = {
    storage: {
        local: {
            get: mockGet,
        },
    },
    runtime: {
        lastError: undefined,
        sendMessage: mockSendMessage,
    },
} as unknown as typeof chrome;

describe('api', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (chrome.runtime.lastError as chrome.runtime.LastError | undefined) = undefined;
    });

    describe('fetchMessages', () => {
        it('should return messages from chrome storage', async () => {
            const mockMessages = [
                { id: '1', content: 'Test message', priority: 'high', timestamp: '2023-05-20T10:00:00Z', read: false },
            ];
            mockGet.mockImplementation((key: string, callback: (result: { [key: string]: any }) => void) => {
                callback({ messages: mockMessages });
            });

            const result = await fetchMessages();
            expect(result).toEqual({ messages: mockMessages });
            expect(mockGet).toHaveBeenCalledWith('messages', expect.any(Function));
        });

        it('should return an empty array if no messages in storage', async () => {
            mockGet.mockImplementation((key: string, callback: (result: { [key: string]: any }) => void) => {
                callback({});
            });

            const result = await fetchMessages();
            expect(result).toEqual({ messages: [] });
        });

        it('should reject with an error if chrome.runtime.lastError is set', async () => {
            const errorMessage = 'Test error';
            (chrome.runtime.lastError as chrome.runtime.LastError) = { message: errorMessage };
            mockGet.mockImplementation((key: string, callback: (result: { [key: string]: any }) => void) => {
                callback({});
            });

            await expect(fetchMessages()).rejects.toThrow(errorMessage);
        });
    });

    describe('markMessageAsRead', () => {
        it('should send a message to mark a message as read', async () => {
            const messageId = '1';
            mockSendMessage.mockImplementation((
                message: { action: string; messageId: string },
                callback: (response: { success: boolean }) => void
            ) => {
                callback({ success: true });
            });

            const result = await markMessageAsRead(messageId);
            expect(result).toBe(true);
            expect(mockSendMessage).toHaveBeenCalledWith(
                { action: 'markAsRead', messageId },
                expect.any(Function)
            );
        });

        it('should return false if the operation was not successful', async () => {
            const messageId = '1';
            mockSendMessage.mockImplementation((
                message: { action: string; messageId: string },
                callback: (response: { success: boolean }) => void
            ) => {
                callback({ success: false });
            });

            const result = await markMessageAsRead(messageId);
            expect(result).toBe(false);
        });
    });
});