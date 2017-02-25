import { RoutinePlan } from "./routine";


/**
 * Represents a task to be performed by a creep.
 */
export interface CreepTask {
  routines: RoutinePlan[];
  prereq: {
    body?: BodyConfig;
  };
};

/**
 * Creates a new creep task.
 */
export const creepTaskFactory = (routines: RoutinePlan[], prereq?: { body: BodyConfig }) => {
  return { routines: routines, prereq: prereq || { } }
}

/**
 * Represents the current task state, either working or done.
 */
export enum CreepTaskState {
  Idle,
  Working
}

/**
 * Represents the portion of creep memory dedicated to tasks.
 */
export interface CreepTaskMemory {
  state: CreepTaskState;
}

/**
 * Represents a reduced body configuration, with each body part
 * as an index of the number of that type of part.
 */
export interface BodyConfig {
  [bodyPart: number]: number;
}

/**
 * Returns true if the given body configuration is compatible with the
 * given task.
 */
export const isCompatible = (bodyConfig: BodyConfig, task: CreepTask) => {

  // Return true if there is no body prerequisite.
  if (task.prereq.body === undefined) {
    return true;
  }

  // If any body part does not meet the requirement of the task, return false.
  for (let bodyPart in bodyConfig) {
    if (task.prereq.body[bodyPart] !== undefined &&
    task.prereq.body[bodyPart] > bodyConfig[bodyPart]) {

      return false;

    }
  }

  return true;

};

/**
 * Returns the task memory from the given creep or an empty done state.
 */
export const getCreepTaskMemory = (creep: Creep): CreepTaskMemory => {

  return creep.memory.task || {
    state: CreepTaskState.Idle
  }

}


/**
 * Returns an object containing a key for each body part with a value
 * representing the number of those parts.
 */
export const getBodyConfig = (creep: Creep): BodyConfig => {
  let parts: BodyConfig = {};
  _.each(creep.body, (part: number) => {
    parts[part] = (parts[part] || 0) + 1;
  });
  return parts;
};
