import {
  CreepTask,
  BodyConfig,
  isCompatible,
  getBodyConfig
} from "./creepTask";

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

/**
 * Returns the next available, compatible task for the given
 * creep, using the task queue for that creep's room.
 *
 * @export
 */
export const findCompatible = (creep: Creep): CreepTask | undefined => {

  // Get the queue for this creep's room.
  let queue = getQueue(creep.room);

  // Get the creep's body config from memory if it exists, otherwise
  // calculate it and store it.
  let config: BodyConfig = creep.memory.bodyConfig ||
    (creep.memory.bodyConfig = getBodyConfig(creep));

  // Starting from the beginning, look for a task which is
  // compatible with this creep.
  let length = queue.length;
  for (let i = 0; i < length; i++) {
    let task = queue[i];
    if (isCompatible(config, task)) {
      return task;
    }
  }

  // No available task.
  return undefined;

}

