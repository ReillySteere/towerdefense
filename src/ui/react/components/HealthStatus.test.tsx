import React from 'react';
import { render, screen } from '@testing-library/react';
import HealthStatus from './HealthStatus';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('HealthStatus Component', () => {
  it('should display loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    });
    render(<HealthStatus />);
    expect(screen.getByText('Loading health status...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    const error = new Error('Failed to fetch');
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: null,
      error,
    });
    render(<HealthStatus />);
    expect(
      screen.getByText(`Error fetching health status: ${error.message}`),
    ).toBeInTheDocument();
  });

  it('should display health data', () => {
    const mockData = { status: 'OK', enemies: [] };
    (useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
    });
    render(<HealthStatus />);
    expect(screen.getByText('Backend Health')).toBeInTheDocument();
    expect(screen.getByText(`Status: ${mockData.status}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Enemies: ${JSON.stringify(mockData.enemies)}`),
    ).toBeInTheDocument();
  });
});
