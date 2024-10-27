import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import useMessages from './hooks/useMessages';

jest.mock('./hooks/useMessages');

describe('App Component', () => {
  test('renders loading message initially', async () => {
    let resolveMessages: (value: any) => void;
    const messagesPromise = new Promise(resolve => {
      resolveMessages = resolve;
    });

    (useMessages as jest.Mock).mockReturnValue({
      messages: [],
      loading: true,
      error: null,
      markAsRead: jest.fn(),
      fetchMessages: () => messagesPromise,
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/loading messages\.\.\./i)).toBeInTheDocument();

    await act(async () => {
      resolveMessages([{ id: '1', content: 'Loading messages...', timestamp: '2023-05-20T10:00:00Z', priority: 'high', read: false }]);
    });

    expect(screen.getByText(/Loading messages.../i)).toBeInTheDocument();
  });

  test('renders messages when loaded', async () => {
    (useMessages as jest.Mock).mockReturnValue({
      messages: [{ id: '1', content: 'Loading messages...', timestamp: '2023-05-20T10:00:00Z', priority: 'high', read: false }],
      loading: false,
      error: null,
      markAsRead: jest.fn(),
      fetchMessages: jest.fn(),
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/Mark as Read/)).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    (useMessages as jest.Mock).mockReturnValue({
      messages: [],
      loading: false,
      error: 'Failed to fetch messages',
      markAsRead: jest.fn(),
      fetchMessages: () => Promise.reject(new Error('Failed to fetch messages')),
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/failed to fetch messages/i)).toBeInTheDocument();
  });
});