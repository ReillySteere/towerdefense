import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from 'ui/api';

const HealthStatus: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  if (isLoading) return <div>Loading health status...</div>;
  if (error)
    return <div>Error fetching health status: {(error as Error).message}</div>;

  return (
    <div>
      <h2>Backend Health</h2>
      <p>Status: {data.status}</p>
      <p>Enemies: {JSON.stringify(data.enemies)}</p>
    </div>
  );
};

export default HealthStatus;
