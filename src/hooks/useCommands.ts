/**
 * useCommands Hook
 * Manages command queue and function definitions
 */

import { useState, useCallback } from 'react';
import type { Command, FunctionDefinition, RobotState, Position } from '@/types';
import { expandCommands, executeCommand, checkWin } from '@/services';
import { MAX_EXECUTION_STEPS, EXECUTION_DELAY } from '@/utils/constants';

interface UseCommandsOptions {
  onWin?: () => void;
  onExecutionStart?: () => void;
  onExecutionEnd?: () => void;
}

interface UseCommandsReturn {
  // State
  commandQueue: Command[];
  functions: FunctionDefinition[];
  isExecuting: boolean;
  recursionWarning: string | null;

  // Actions
  addCommand: (cmd: Command) => void;
  clearQueue: () => void;
  setFunctions: React.Dispatch<React.SetStateAction<FunctionDefinition[]>>;
  clearWarning: () => void;
  runCommands: (
    robot: RobotState,
    setRobot: (robot: RobotState) => void,
    starPositions: Position[],
    collectedStars: Set<string>,
    collectStar: (position: Position) => void,
    hasKey: boolean,
    collectKey: () => void,
    gridSize: number,
    obstacles: Position[],
    keys: Position[],
    doors: Position[]
  ) => Promise<boolean>;
  reset: () => void;
}

const DEFAULT_FUNCTIONS: FunctionDefinition[] = [
  { name: 'F0', commands: [] },
  { name: 'F1', commands: [] },
  { name: 'F2', commands: [] },
];

export const useCommands = (options: UseCommandsOptions = {}): UseCommandsReturn => {
  const { onWin, onExecutionStart, onExecutionEnd } = options;

  const [commandQueue, setCommandQueue] = useState<Command[]>([]);
  const [functions, setFunctions] = useState<FunctionDefinition[]>(DEFAULT_FUNCTIONS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [recursionWarning, setRecursionWarning] = useState<string | null>(null);

  // Add a command to the queue
  const addCommand = useCallback(
    (cmd: Command) => {
      if (isExecuting) return;
      setCommandQueue(prev => [...prev, cmd]);
    },
    [isExecuting]
  );

  // Clear the command queue
  const clearQueue = useCallback(() => {
    setCommandQueue([]);
  }, []);

  // Clear warning message
  const clearWarning = useCallback(() => {
    setRecursionWarning(null);
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setCommandQueue([]);
    setIsExecuting(false);
    setRecursionWarning(null);
  }, []);

  // Execute commands with animation
  const runCommands = useCallback(
    async (
      robot: RobotState,
      setRobot: (robot: RobotState) => void,
      starPositions: Position[],
      collectedStars: Set<string>,
      collectStar: (position: Position) => void,
      hasKey: boolean,
      collectKey: () => void,
      gridSize: number,
      obstacles: Position[],
      keys: Position[] = [],
      doors: Position[] = []
    ): Promise<boolean> => {
      setIsExecuting(true);
      setRecursionWarning(null);
      onExecutionStart?.();

      // Expand function calls
      const { commands: expandedCommands, warning } = expandCommands(commandQueue, functions);

      if (warning) {
        setRecursionWarning(warning);
      }

      console.log('📋 Comandos expandidos:', expandedCommands);

      // Protection against infinite loops
      if (expandedCommands.length > MAX_EXECUTION_STEPS) {
        alert(
          `⚠️ Muitos comandos! Limite de ${MAX_EXECUTION_STEPS} passos excedido. Verifique se há recursão infinita.`
        );
        setIsExecuting(false);
        onExecutionEnd?.();
        return false;
      }

      let currentRobot = { ...robot };
      let currentCollectedStars = new Set(collectedStars);
      let currentHasKey = hasKey;

      for (let i = 0; i < expandedCommands.length; i++) {
        const cmd = expandedCommands[i];

        // Delay between commands for animation
        await new Promise(resolve => setTimeout(resolve, EXECUTION_DELAY));

        // Check if next position has a door and we don't have the key
        const nextRobot = executeCommand(currentRobot, cmd, gridSize, obstacles);
        const isDoor = doors.some(d => d.x === nextRobot.x && d.y === nextRobot.y);

        if (isDoor && !currentHasKey) {
          // Can't move through door without key - stay in place
          console.log('🚪 Porta bloqueada! Chave necessária.');
          continue; // Skip this movement
        }

        // Execute command
        currentRobot = nextRobot;
        setRobot(currentRobot);

        // Check if robot is on a key
        const robotPos = { x: currentRobot.x, y: currentRobot.y };
        const isOnKey = keys.some(k => k.x === robotPos.x && k.y === robotPos.y);
        if (isOnKey && !currentHasKey) {
          collectKey();
          currentHasKey = true;
          console.log('🔑 Chave coletada!');
        }

        // Check if robot is on any uncollected star
        for (const starPos of starPositions) {
          const starKey = `${starPos.x},${starPos.y}`;
          if (
            checkWin(robotPos, starPos) &&
            !currentCollectedStars.has(starKey)
          ) {
            collectStar(starPos);
            currentCollectedStars.add(starKey);
            console.log('⭐ Star collected at:', starPos);
          }
        }

        // Check win condition - all stars collected
        if (currentCollectedStars.size === starPositions.length) {
          // Small delay to visualize robot at last star before callback
          await new Promise(resolve => setTimeout(resolve, 200));
          setIsExecuting(false);
          onExecutionEnd?.();
          onWin?.();
          return true;
        }
      }

      setIsExecuting(false);
      onExecutionEnd?.();
      return false;
    },
    [commandQueue, functions, onWin, onExecutionStart, onExecutionEnd]
  );

  return {
    // State
    commandQueue,
    functions,
    isExecuting,
    recursionWarning,

    // Actions
    addCommand,
    clearQueue,
    setFunctions,
    clearWarning,
    runCommands,
    reset,
  };
};

export default useCommands;
