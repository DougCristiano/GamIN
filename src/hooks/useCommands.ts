/**
 * useCommands Hook
 * Manages command queue and function definitions
 */

import { useState, useCallback } from 'react';
import type { Command, FunctionDefinition, RobotState, Position, KeyItem, DoorItem, ColoredCell, CellColor } from '@/types';
import { expandCommands, executeCommand, checkWin } from '@/services';
import { MAX_EXECUTION_STEPS, EXECUTION_DELAY } from '@/utils/constants';

interface UseCommandsOptions {
  onWin?: () => void;
  onExecutionStart?: () => void;
  onExecutionEnd?: () => void;
  onError?: (message: string) => void;
}

interface UseCommandsReturn {
  // State
  commandQueue: Command[];
  functions: FunctionDefinition[];
  isExecuting: boolean;
  recursionWarning: string | null;
  currentCommandIndex: number;

  // Actions
  addCommand: (cmd: Command) => void;
  removeLastCommand: () => void;
  clearQueue: () => void;
  setFunctions: React.Dispatch<React.SetStateAction<FunctionDefinition[]>>;
  clearWarning: () => void;
  runCommands: (
    robot: RobotState,
    setRobot: (robot: RobotState) => void,
    starPositions: Position[],
    collectedStars: Set<string>,
    collectStar: (position: Position) => void,
    collectedKeys: Set<string>,
    collectKey: (keyId: string) => void,
    gridSize: number,
    obstacles: Position[],
    keys: KeyItem[],
    doors: DoorItem[],
    coloredCells?: ColoredCell[],
    paintCell?: (position: Position, color: CellColor) => void
  ) => Promise<boolean>;
  reset: () => void;
}

const DEFAULT_FUNCTIONS: FunctionDefinition[] = [
  { name: 'F0', commands: [] },
  { name: 'F1', commands: [] },
  { name: 'F2', commands: [] },
];

export const useCommands = (options: UseCommandsOptions = {}): UseCommandsReturn => {
  const { onWin, onExecutionStart, onExecutionEnd, onError } = options;

  const [commandQueue, setCommandQueue] = useState<Command[]>([]);
  const [functions, setFunctions] = useState<FunctionDefinition[]>(DEFAULT_FUNCTIONS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [recursionWarning, setRecursionWarning] = useState<string | null>(null);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1);

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
    setCurrentCommandIndex(-1);
  }, []);

  // Execute commands with animation
  const runCommands = useCallback(
    async (
      robot: RobotState,
      setRobot: (robot: RobotState) => void,
      starPositions: Position[],
      collectedStars: Set<string>,
      collectStar: (position: Position) => void,
      collectedKeys: Set<string>,
      collectKey: (keyId: string) => void,
      gridSize: number,
      obstacles: Position[],
      keys: KeyItem[] = [],
      doors: DoorItem[] = [],
      coloredCells: ColoredCell[] = [],
      paintCell?: (position: Position, color: CellColor) => void
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
        const msg = `⚠️ Muitos comandos! Limite de ${MAX_EXECUTION_STEPS} passos excedido. Verifique se há recursão infinita.`;
        if (onError) {
          onError(msg);
        } else {
          alert(msg);
        }
        setIsExecuting(false);
        onExecutionEnd?.();
        return false;
      }

      let currentRobot = { ...robot };
      let currentCollectedStars = new Set(collectedStars);
      let currentCollectedKeys = new Set(collectedKeys);
      // Clone colored cells to track local changes during execution
      let currentColoredCells = [...coloredCells];

      for (let i = 0; i < expandedCommands.length; i++) {
        const cmd = expandedCommands[i];
        setCurrentCommandIndex(i);

        // Handles PAINT commands
        if (cmd.startsWith('PAINT_')) {
          const color = cmd.replace('PAINT_', '') as CellColor;
          paintCell?.({ x: currentRobot.x, y: currentRobot.y }, color);

          // Update local state for subsequent checks
          const existingCellIndex = currentColoredCells.findIndex(
            c => c.position.x === currentRobot.x && c.position.y === currentRobot.y
          );

          if (existingCellIndex >= 0) {
            // Update existing cell locally
            const updatedCells = [...currentColoredCells];
            updatedCells[existingCellIndex] = { ...updatedCells[existingCellIndex], color };
            currentColoredCells = updatedCells;
          } else {
            // Add new cell locally
            currentColoredCells = [...currentColoredCells, { position: { x: currentRobot.x, y: currentRobot.y }, color }];
          }

          await new Promise(resolve => setTimeout(resolve, EXECUTION_DELAY / 2));
          continue;
        }

        // Handles IF commands (Conditional Logic)
        if (cmd.startsWith('IF_')) {
          const requiredColor = cmd.replace('IF_', '') as CellColor;
          const currentCell = currentColoredCells.find(
            c => c.position.x === currentRobot.x && c.position.y === currentRobot.y
          );

          const isConditionMet = currentCell?.color === requiredColor;

          if (!isConditionMet) {
            console.log(`Condition ${cmd} failed (Current: ${currentCell?.color || 'None'}) - Skipping next command`);
            // Skip the NEXT command
            i++;
          } else {
            console.log(`Condition ${cmd} met - Executing next command`);
          }
          continue;
        }

        // Delay between commands for animation
        await new Promise(resolve => setTimeout(resolve, EXECUTION_DELAY));

        // Check if next position has a door and we don't have the key
        const nextRobot = executeCommand(currentRobot, cmd, gridSize, obstacles);
        const doorAtPosition = doors.find(d => d.position.x === nextRobot.x && d.position.y === nextRobot.y);

        if (doorAtPosition && !currentCollectedKeys.has(doorAtPosition.id)) {
          // Can't move through door without matching key - stay in place
          console.log(`🚪 Porta ${doorAtPosition.id} bloqueada! Chave ${doorAtPosition.id} necessária.`);
          continue; // Skip this movement
        }

        // Execute command
        currentRobot = nextRobot;
        setRobot(currentRobot);

        // Check if robot is on a key
        const robotPos = { x: currentRobot.x, y: currentRobot.y };
        const keyAtPosition = keys.find(k => k.position.x === robotPos.x && k.position.y === robotPos.y);
        if (keyAtPosition && !currentCollectedKeys.has(keyAtPosition.id)) {
          collectKey(keyAtPosition.id);
          currentCollectedKeys.add(keyAtPosition.id);
          console.log(`🔑 Chave ${keyAtPosition.id} coletada!`);
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
      setCurrentCommandIndex(-1);
      onExecutionEnd?.();
      return false;
    },
    [commandQueue, functions, onWin, onExecutionStart, onExecutionEnd, onError]
  );

  // Remove the last command from the queue
  const removeLastCommand = useCallback(() => {
    if (isExecuting) return;
    setCommandQueue(prev => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, [isExecuting]);

  return {
    // State
    commandQueue,
    functions,
    isExecuting,
    recursionWarning,
    currentCommandIndex,

    // Actions
    addCommand,
    removeLastCommand,
    clearQueue,
    setFunctions,
    clearWarning,
    runCommands,
    reset,
  };
};

export default useCommands;
