import * as routineIndex from "./routines";

/**
 * Represents a routine object which can be executed.
 */
export interface Routine {
  start(creep: Creep): void;
  execute(creep: Creep): void;
}


/**
 * Represents the current routine state.
 */
export enum RoutineState {
  Working,
  Done
}

/**
 * Represents the portion of creep memory dedicated to the
 * current routines.
 */
export interface RoutineMemory {
  state: RoutineState;
  routines: RoutinePlan[];
  cache: { [name: string]: any };
}

/**
 * Represents a plan for a routine.
 */
export interface RoutinePlan {
  name: string,
  options: {
    [name: string]: any;
  }
}

/**
 * Create a new routine plan.
 */
export const routinePlanFactory = (name: string, options: {}) {
  return { name: name, options: options };
}

/**
 * Retrieves the routine memory for the given creep.
 */
export const getRoutineMemory = (creep: Creep): RoutineMemory => {
  return creep.memory.routine;
}

/**
 * Retrieves the memory for the current routine of the given creep.
 */
export const getCurrentRoutinePlan = (creep: Creep): RoutinePlan => {
  return getRoutineMemory(creep).routines[0];
}


/**
 * Executes the current routine for the given creep.
 */
export const executeCurrentRoutine = (creep: Creep): boolean => {

  // Execute the current routine.
  let routineMemory = getRoutineMemory(creep);
  let currentRoutinePlan = getCurrentRoutinePlan(creep);
  let routine = routineIndex.routines[currentRoutinePlan.name] as Routine;
  routine.execute(creep);

  // If complete, remove the current routine from queue.
  if (routineMemory.state = RoutineState.Done) {

    // Remove the current routine from memory.
    routineMemory.routines.splice(0, 1);

    // Clear the cache.
    routineMemory.cache = {};

    if (routineMemory.routines.length > 0) {
      // Start the next routine.
      currentRoutinePlan = getCurrentRoutinePlan(creep);
      routine = routineIndex.routines[currentRoutinePlan.name] as Routine;
      routine.start(creep);
    }
    else {
      return true;
    }

  }

  return false;

}
