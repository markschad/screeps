import { CreepTask } from "./creepTask";

/**
 * Retrieves the task queue for the given room.
 */
export const getQueue = (room: Room): CreepTask[] => {
  return room.memory.creepTaskQueue || (room.memory.creepTaskQueue = []);
}

/**
 * Pushes a new tasks on to the end of the queue.
 */
export const push = (room: Room, task: CreepTask) => {
  let queue = getQueue(room);
  queue.push(task);
}


export const popNextCompatible
