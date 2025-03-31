import { fetchGreeting } from './api';

describe('fetchGreeting', () => {
  it('should eventually return the correct greeting message using fake timers', async () => {
    jest.useFakeTimers();
    const promise = fetchGreeting();
    jest.advanceTimersByTime(1000);
    const greeting = await promise;
    expect(greeting).toBe('Hello from the API!');
    jest.useRealTimers();
  });

  it('should return the correct greeting message without fake timers', async () => {
    const greeting = await fetchGreeting();
    expect(greeting).toBe('Hello from the API!');
  });
});
