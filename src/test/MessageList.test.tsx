import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageList from '../components/MessageList';
import useMessages from '../hooks/useMessages';

// Mock the useMessages hook
jest.mock('../hooks/useMessages');

describe('MessageList', () => {
    // Helper function to mock useMessages with different states
    const mockUseMessages = (state: {
        messages?: any[];
        loading?: boolean;
        error?: string | null;
        markAsRead?: jest.Mock;
    }) => {
        (useMessages as jest.Mock).mockReturnValue({
            messages: [],
            loading: false,
            error: null,
            markAsRead: jest.fn(),
            ...state,
        });
    };

    it('displays loading state', () => {
        mockUseMessages({ loading: true });
        render(<MessageList />);
        expect(screen.getByText('Loading messages...')).toBeInTheDocument();
    });

    it('displays error state', () => {
        mockUseMessages({ error: 'Failed to fetch messages' });
        render(<MessageList />);
        expect(screen.getByText('Error: Failed to fetch messages')).toBeInTheDocument();
    });

    it('displays no messages state', () => {
        mockUseMessages({ messages: [] });
        render(<MessageList />);
        expect(screen.getByText('No messages')).toBeInTheDocument();
    });

    it('renders messages correctly', () => {
        const mockMessages = [
            { id: '1', content: 'Test message 1', timestamp: '2023-05-20T10:00:00Z', priority: 'high', read: false },
            { id: '2', content: 'Test message 2', timestamp: '2023-05-20T11:00:00Z', priority: 'low', read: true },
        ];
        mockUseMessages({ messages: mockMessages });
        render(<MessageList />);

        expect(screen.getByText('Organization Messages')).toBeInTheDocument();
        expect(screen.getByText('Test message 1')).toBeInTheDocument();
        expect(screen.getByText('Test message 2')).toBeInTheDocument();
        expect(screen.getByText('High Priority')).toBeInTheDocument();
        expect(screen.getByText('Low Priority')).toBeInTheDocument();
    });

    it('calls markAsRead when "Mark as Read" button is clicked', () => {
        const mockMarkAsRead = jest.fn();
        const mockMessages = [
            { id: '1', content: 'Test message', timestamp: '2023-05-20T10:00:00Z', priority: 'high', read: false },
        ];
        mockUseMessages({ messages: mockMessages, markAsRead: mockMarkAsRead });
        render(<MessageList />);

        const markAsReadButton = screen.getByText('Mark as Read');
        fireEvent.click(markAsReadButton);

        expect(mockMarkAsRead).toHaveBeenCalledWith('1');
    });

    it('does not show "Mark as Read" button for read messages', () => {
        const mockMessages = [
            { id: '1', content: 'Test message', timestamp: '2023-05-20T10:00:00Z', priority: 'high', read: true },
        ];
        mockUseMessages({ messages: mockMessages });
        render(<MessageList />);

        expect(screen.queryByText('Mark as Read')).not.toBeInTheDocument();
    });
});