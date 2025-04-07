import React from 'react';
import { render, screen, fireEvent } from 'ui/react/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { useGameStore } from './store';
import fetchHealth from 'ui/api/fetchHealth';

jest.mock('./store', () => ({
  useGameStore: jest.fn(),
}));

jest.mock('ui/api/fetchHealth');

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
    (fetchHealth as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Loading health.../i)).toBeInTheDocument();
  });

  it('renders health after successful fetch', async () => {
    (fetchHealth as jest.Mock).mockResolvedValue('Healthy API');
    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/"Healthy API"/i)).toBeInTheDocument();
  });

  it('handles fetch error correctly', async () => {
    (fetchHealth as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText(/Error fetching health/i),
    ).toBeInTheDocument();
  });

  it('increments score when button is clicked', () => {
    (fetchHealth as jest.Mock).mockResolvedValue('Healthy API');
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
    (fetchHealth as jest.Mock).mockResolvedValue('Healthy API');
    render(
      <QueryClientProvider client={createQueryClient()}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Score: 5/i)).toBeInTheDocument();
  });
});
