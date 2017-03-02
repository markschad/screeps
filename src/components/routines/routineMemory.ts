import { RoutineState } from "./routineState";
import { RoutinePlan } from "./routinePlan";

/**
 * Represents the complete routine memory path.
 */
export interface RoutineMemoryMap {
  creeps: {
    [creepName: string]: {
      routine: RoutineMemory;
    };
  };
}

/**
 * Represents the portion of creep memory dedicated to the
 * current routines.
 */
export interface RoutineMemory {
  state: RoutineState;
  plan: RoutinePlan | null;
  cache: { [name: string]: any };
}

/**
 * Retrieves the routine memory for the given creep.
 */
export const getRoutineMemory = (creep: Creep): RoutineMemory => {
  return creep.memory.routine;
};
