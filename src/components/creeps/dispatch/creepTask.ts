
/**
 * Represents a task to be performed by a creep.
 */
export interface CreepTask {
  routine: string[];
  prerequisites: {};
};

/**
 * Returns true if the given creep is compatible with the given task.
 */
export const isCompatible = (creep: Creep, task: CreepTask) => {

  return true;

};
