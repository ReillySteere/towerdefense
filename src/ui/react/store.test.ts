import { create } from 'zustand';
import { useGameStore } from './store';

describe('useGameStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useGameStore.setState({ score: 0 });
  });

  it('should initialize with a score of 0', () => {
    const { score } = useGameStore.getState();
    expect(score).toBe(0);
  });

  it('should increment the score by 1 when incrementScore is called', () => {
    const storeState = useGameStore.getState();
    storeState.incrementScore();
    expect(useGameStore.getState().score).toBe(1);
  });

  it('should increment the score cumulatively', () => {
    const initialScore = useGameStore.getState().score;
    useGameStore.getState().incrementScore();
    useGameStore.getState().incrementScore();
    expect(useGameStore.getState().score).toBe(initialScore + 2);
  });

  it('should reset the score to 0 between tests', () => {
    useGameStore.getState().incrementScore();
    expect(useGameStore.getState().score).toBe(1);

    // Reset state
    useGameStore.setState({ score: 0 });
    expect(useGameStore.getState().score).toBe(0);
  });

  it('should handle multiple increments correctly', () => {
    const storeState = useGameStore.getState();
    for (let i = 0; i < 5; i++) {
      storeState.incrementScore();
    }
    expect(useGameStore.getState().score).toBe(5);
  });
});
