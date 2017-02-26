import { log } from "../../support/log";

import * as routineHelper from "./routine";
import * as routineIndex from "./routines/index";
import * as interactionsHelper from "../../common/interactions";

/**
 * Represents the interactions in a task.
 */
export interface CreepTaskInteractions {
  [objectId: string]: string[];
}

/**
 * Represents the prerequisites of a task.
 */
export interface CreepTaskPrereq {
  body?: BodyConfig;
}

/**
 * Represents a task to be performed by a creep.
 */
export interface CreepTask {
  assignedTo: string | null;
  id: number;
  name: string;
  routines: routineHelper.RoutinePlan[];
  prereq: CreepTaskPrereq;
  interactions: CreepTaskInteractions;
};

/**
 * Creates a new creep task.
 */
export const creepTaskFactory = (
  routines: routineHelper.RoutinePlan[],
  interactions: CreepTaskInteractions,
  name: string,
  prereq?: CreepTaskPrereq): CreepTask => {

    // Retrieve the next id and increment the universal unique id counter.
    let nextId: number = Memory.tasks.uuid++;

    return {
      assignedTo: null,
      id: nextId,
      interactions: interactions,
      name: name,
      prereq: prereq || { },
      routines: routines,
    };
};

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
  task: CreepTask | null;
  currentRoutine: number;
}

/**
 * Represents a reduced body configuration, with each body part
 * as an index of the number of that type of part.
 */
export interface BodyConfig {
  [bodyPart: string]: number;
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

  return creep.memory.task || (creep.memory.task = {
    currentRoutine: 0,
    state: CreepTaskState.Idle,
    task: null,
  });

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

/**
 * Returns a body part array of representing the given body config.
 */
export const toBody = (config: BodyConfig, multiplier: number = 1): string[] => {

  let body: string[] = [];
  for (let part in config) {
    _.times(config[part] * multiplier, () => {
      body.push(part);
    });
  }
  return body;

}

/**
 * Registers interactions for this task.
 */
export const registerInteractions = (task: CreepTask) => {
  let interactions = task.interactions;
  for (let objectId in interactions) {
    log.debug("Registering interactions for object " + objectId);
    _.each(interactions[objectId], (interaction) => {
      log.debug("Registering interaction " + interaction);
      interactionsHelper.registerInteraction(objectId, interaction);
    });
  }
}

/**
 * Unregisters interactions for this task.
 */
export const unregisterInteractions = (task: CreepTask) => {
  let interactions = task.interactions;
  for (let objectId in interactions) {
    _.each(interactions[objectId], (interaction) => {
      interactionsHelper.unregisterInteraction(objectId, interaction);
    });
  }
};

/**
 * Executes the current routine for the given creep.
 */
export const executeRoutine = (creep: Creep): routineHelper.RoutineState => {

  // Execute the current routine.
  let routineMemory = routineHelper.getRoutineMemory(creep);
  let plan = routineMemory.routine;

  if (plan) {

    let routine = routineIndex.routines[plan.name] as routineHelper.Routine;
    let result = routine.execute(creep);

    // Clear the cache if we've finished.
    if (result === routineHelper.RoutineState.Done) {
      routineMemory.cache = {};
    }

    return result;
  } else {
    log.debug("plan is undefined or null.");
    return routineHelper.RoutineState.Done;
  }

};

/**
 * Initialises the current routine for the given creep.
 */
export const startRoutine = (creep: Creep): void => {

  log.debug("startRoutine for creep " + creep.name);

  // Start the current routine.
  let routineMemory = routineHelper.getRoutineMemory(creep);
  routineMemory.state = routineHelper.RoutineState.Working;
  let plan = routineMemory.routine;

  if (plan) {
    let routine = routineIndex.routines[plan.name] as routineHelper.Routine;
    routine.start(creep);
  } else {
    log.debug("startRoutine error no routine");
  }

};

