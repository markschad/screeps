import { CreepTask } from "./creepTask";

/**
 * Dispatches the given creep, assigning it a new task if it is idle.
 */
export const dispatch = (creep: Creep): void => {

  // Retrieve the task queue.
  let queue: CreepTask[] = creep.room.memory.creepTaskQueue;

  // Find the next compatible task in the queue.

};
