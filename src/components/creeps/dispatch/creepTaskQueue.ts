import {
  CreepTask,
  BodyConfig,
  isCompatible,
  getBodyConfig,
} from "./creepTask";

/**
 * Retrieves the task queue for the given room.
 */
export const getQueue = (room: Room): CreepTask[] => {
  return room.memory.creepTaskQueue || (room.memory.creepTaskQueue = []);
};

/**
 * Retrieves the list of tasks which have been assigned.
 */
export const getAssigned = (room: Room): CreepTask[] => {
  return room.memory.creepTaskAssigned || (room.memory.creepTaskAssigned = []);
};

export const getNumQueuedOrActiveWithName = (room: Room, name: string) => {
  return getQueue(room).filter(t => t.name === name).length +
    getAssigned(room).filter(t => t.name === name).length;
};

/**
 * Pushes a new tasks on to the end of the queue.
 */
export const enqueuePending = (room: Room, task: CreepTask) => {
  let queue = getQueue(room);
  queue.push(task);
};

/**
 * Returns the next available, compatible task for the given
 * creep, using the task queue for that creep's room.
 *
 * @export
 */
export const findCompatible = (creep: Creep): CreepTask | null => {

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
  return null;

};

/**
 * Moves the given task from the pending queue to the list of assigned.
 */
export const moveTaskToAssigned = (task: CreepTask, room: Room) => {
  let queue = getQueue(room);
  let len = queue.length;
  for (let i = 0; i < len; i++) {
    if (queue[i].id === task.id) {
      queue.splice(i, 1);
      getAssigned(room).push(task);
      return;
    }
  }
};

/**
 * Removes the given task from the assigned tasks list of the given room.
 */
export const removeTaskFromAssigned = (task: CreepTask, room: Room) => {
  let queue = getAssigned(room);
  let len = queue.length;
  for (let i = 0; i < len; i++) {
    if (queue[i].id === task.id) {
      queue.splice(i, 1);
      return;
    }
  }
};
