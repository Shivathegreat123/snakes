import { useState, useEffect, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface GameState {
  snake: Point[];
  food: Point;
  direction: Point;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      const newHead = {
        x: (head.x + prev.direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + prev.direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setGameState(prev => prev.direction.y === 1 ? prev : { ...prev, direction: { x: 0, y: -1 } });
          break;
        case 'ArrowDown':
          setGameState(prev => prev.direction.y === -1 ? prev : { ...prev, direction: { x: 0, y: 1 } });
          break;
        case 'ArrowLeft':
          setGameState(prev => prev.direction.x === 1 ? prev : { ...prev, direction: { x: -1, y: 0 } });
          break;
        case 'ArrowRight':
          setGameState(prev => prev.direction.x === -1 ? prev : { ...prev, direction: { x: 1, y: 0 } });
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 5, y: 5 },
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return {
    ...gameState,
    resetGame,
    togglePause,
    GRID_SIZE,
  };
}
