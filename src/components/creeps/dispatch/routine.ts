/**
 * Represents a routine object which can be executed.
 */
export interface Routine {
  start(creep: Creep): void;
  execute(creep: Creep): RoutineState;
}


/**
 * Represents the current routine state.
 */
export enum RoutineState {
  Working,
  CantWork,
  Done
}

/**
 * Represents the portion of creep memory dedicated to the
 * current routines.
 */
export interface RoutineMemory {
  state: RoutineState;
  routine: RoutinePlan | null;
  cache: { [name: string]: any };
}

/**
 * Represents a plan for a routine.
 */
export interface RoutinePlan {
  name: string;
  options: {
    [name: string]: any;
  };
}

/**
 * Create a new routine plan.
 */
export const routinePlanFactory = (name: string, options: {}) => {
  return { name: name, options: options };
};

/**
 * Retrieves the routine memory for the given creep.
 */
export const getRoutineMemory = (creep: Creep): RoutineMemory => {
  return creep.memory.routine || (creep.memory.routine = {
    cache: {},
    routine: null,
    state: RoutineState.Done,
});
};

/**
 * Sets the routine in memory for this creep.
 */
export const setCurrentRoutineMemory = (creep: Creep, plan: RoutinePlan): void => {
  getRoutineMemory(creep).routine = plan;
};
