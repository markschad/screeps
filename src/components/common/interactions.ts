// import { log } from "../support/log";

/**
 * Represents the current number of interactions of each type against
 * each object id.
 */
export interface InteractionsMemory {
  [objectId: string]: {
    [type: string]: number;
  };
}

/**
 * Register a new interaction of the given type for the given object id.
 */
export const registerInteraction = (objectId: string, interaction: string) => {
  let object = Memory.interactions[objectId];
  if (!object) {
    Memory.interactions[objectId] = object = {};
  }
  object[interaction] = (object[interaction] || 0) + 1;
};

/**
 * Unregister an interaction of the given type for the given object id.
 */
export const unregisterInteraction = (objectId: string, interaction: string) => {
  Memory.interactions[objectId][interaction]--;
};

/**
 * Retrieves the number of interactions for the given type against the given object id.
 */
export const getInteractions = (objectId: string, interaction: string) => {
  let object = Memory.interactions[objectId];
  if (object) {
    return object[interaction] || 0;
  } else {
    return 0;
  }
};
