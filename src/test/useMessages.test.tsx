// userMessages.test.tsx
import { renderHook, act } from '@testing-library/react';
import useMessages from '../hooks/useMessages';
import { fetchMessages, markMessageAsRead } from '@/services/api';
import { Message } from '@/types/types';

// Mock the api functions
jest.mock('@/services/api');
const mockedFetchMessages = fetchMessages as jest.MockedFunction<typeof fetchMessages>;
const mockedMarkMessageAsRead = markMessageAsRead as jest.MockedFunction<typeof markMessageAsRead>;

// Mock the SoundManager
jest.mock('@/utils/sound', () => ({
    SoundManager: {
        getInstance: () => ({
            playNotification: jest.fn(),
        }),
    },
}));

describe('useMessages', () => {
    const mockMessages: Message[] = [
        {
            id: '1',
            content: 'Test message',
            priority: 'high',
            timestamp: '2023-05-20T10:00:00Z',
            read: false,
        },
    ];

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup default mock implementations
        mockedFetchMessages.mockResolvedValue({ messages: mockMessages });
        mockedMarkMessageAsRead.mockResolvedValue(true);
    });

    it('should fetch messages on mount', async () => {
        const { result } = renderHook(() => useMessages());

        // Initial state
        expect(result.current.loading).toBe(true);
        expect(result.current.messages).toEqual([]);
        expect(result.current.error).toBeNull();

        // Wait for the fetch to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.messages).toEqual(mockMessages);
        expect(result.current.error).toBeNull();
        expect(mockedFetchMessages).toHaveBeenCalledTimes(1);
    });

    it('should mark a message as read', async () => {
        const { result } = renderHook(() => useMessages());

        // Wait for initial fetch
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Mark message as read
        await act(async () => {
            await result.current.markAsRead('1');
        });

        expect(mockedMarkMessageAsRead).toHaveBeenCalledWith('1');
        expect(result.current.messages[0].read).toBe(true);
    });

    it('should handle fetch error', async () => {
        const error = new Error('Failed to fetch');
        mockedFetchMessages.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useMessages());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Failed to fetch');
        expect(result.current.messages).toEqual([]);
    });

    it('should set loading to true during fetch', async () => {
        const { result } = renderHook(() => useMessages());

        const loadingDuringFetch = result.current.loading;

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(loadingDuringFetch).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.messages).toEqual(mockMessages);
    });

    it('should clear error when clearError is called', async () => {
        const error = new Error('Test error');
        mockedFetchMessages.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useMessages());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.error).toBe('Test error');

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });


    it('should not play sound for existing messages', async () => {
        // Start with existing messages
        const { result } = renderHook(() => useMessages());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Fetch the same messages again
        await act(async () => {
            await result.current.fetchMessagesData();
        });

        // Verify the sound manager was not called
        const soundManager = require('@/utils/sound').SoundManager.getInstance();
        expect(soundManager.playNotification).not.toHaveBeenCalled();
    });

    it('should handle mark as read failure', async () => {
        mockedMarkMessageAsRead.mockResolvedValueOnce(false);

        const { result } = renderHook(() => useMessages());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        await act(async () => {
            await result.current.markAsRead('1');
        });

        expect(result.current.error).toBe('Failed to mark message as read');
        expect(result.current.messages[0].read).toBe(false);
    });
});