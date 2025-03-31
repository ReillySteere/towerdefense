import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { useGameStore } from './store';
import * as api from '../api';

jest.mock('./store', () => ({
  useGameStore: jest.fn(),
}));

jest.mock('../api');

const mockedIncrementScore = jest.fn();

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

describe('App Component', () => {
  beforeEach(() => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      score: 0,
      incrementScore: mockedIncrementScore,
    });
  });

  it('renders loading state initially', () => {
    (api.fetchGreeting as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves

    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Loading greeting.../i)).toBeInTheDocument();
  });

  it('renders greeting after successful fetch', async () => {
    (api.fetchGreeting as jest.Mock).mockResolvedValue('Hello from the API!');

    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText(/"Hello from the API!"/i),
    ).toBeInTheDocument();
  });

  it('handles fetch error correctly', async () => {
    (api.fetchGreeting as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText(/Error fetching greeting/i),
    ).toBeInTheDocument();
  });

  it('increments score when button is clicked', () => {
    (api.fetchGreeting as jest.Mock).mockResolvedValue('Hello from the API!');

    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText(/Increment Score/i));

    expect(mockedIncrementScore).toHaveBeenCalled();
  });

  it('displays score from store correctly', () => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      score: 5,
      incrementScore: mockedIncrementScore,
    });
    (api.fetchGreeting as jest.Mock).mockResolvedValue('Hello from the API!');

    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Score: 5/i)).toBeInTheDocument();
  });
});
