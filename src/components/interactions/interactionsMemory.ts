import { InteractionCollection } from "./interactionCollection";

/**
 * Represents the portion of memory dedicated to interactions.
 */
export interface InteractionsMemory {
  [objectId: string]: InteractionCollection;
}

/**
 * Retrieves the interactions memory.  Iniitialises it if necessary.
 */
export const getInteractionsMemory = (): InteractionsMemory => {
  return Memory.interactions || (Memory.interactions = {});
};

/**
 * Retrieves the interactions collection for the given
 */
export const getInteractions = (objectId: string): InteractionCollection | null => {
  return Memory.interactions[objectId] || null;
};
