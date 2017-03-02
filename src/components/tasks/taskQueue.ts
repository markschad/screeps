import { TaskPlan } from "./taskPlan";
import * as taskMemory from "./taskMemory";

/**
 * Retrieves the queued tasks for the given room.
 */
export const getQueuedTasks = (room: Room): TaskPlan[] => {
  let taskRoomMemory = taskMemory.getTaskRoomMemory(room);
  return taskRoomMemory.queued;
};

/**
 * Retrieves the assigned tasks for the given room.
 */
export const getAssignedTasks = (room: Room): TaskPlan[] => {
  let taskRoomMemory = taskMemory.getTaskRoomMemory(room);
  return taskRoomMemory.assigned;
};

/**
 * Retrieves the number of queued or assigned tasks in the given room with the given name.
 */
export const getNumQueuedOrActiveWithName = (room: Room, taskName: string) => {
  let taskRoomMemory = taskMemory.getTaskRoomMemory(room);
  let numQueued = taskRoomMemory.queued.filter(t => t.name === taskName).length;
  let numAssigned = taskRoomMemory.assigned.filter(t => t.name === taskName).length;
  return numQueued + numAssigned;
};

/**
 * Enqueues the given task in the given room, returning the tasks position in the queue.
 * @param task The task to queue.
 * @param room The room in which the task should be queued.
 */
export const enqueue = (task: TaskPlan, room: Room): number => {
  let queue = getQueuedTasks(room);
  let queueLen = queue.length;
  for (let i = 0; i < queueLen; i++) {
    let otherTask = queue[i];
    if (task.priority >= otherTask.priority) {
      queue.splice(i, 0, task);
      return i;
    }
  }
  queue.push(task);
  return queueLen;
};

/**
 * Moves the given task from queued to assigned in the given room.
 */
export const moveTaskToAssigned = (task: TaskPlan, room: Room) => {
  let queuedTasks = getQueuedTasks(room);
  let len = queuedTasks.length;
  for (let i = 0; i < len; i++) {
    if (queuedTasks[i].id === task.id) {
      getAssignedTasks(room).push(queuedTasks.splice(i, 1)[0]);
    }
  }
};

/**
 * Removes the given task from the assigned tasks list in the given room.
 */
export const removeTaskFromAssigned = (task: TaskPlan, room: Room) => {
  let assignedTasks = getAssignedTasks(room);
  let len = assignedTasks.length;
  for (let i = 0; i < len; i++) {
    if (assignedTasks[i].id === task.id) {
      assignedTasks.splice(i, 1);
      return;
    }
  }
};

/**
 * Assigns the given task to the given creep.
 */
export const assignTaskToCreep = (task: TaskPlan, creep: Creep) => {
  let taskCreepMemory = taskMemory.getTaskCreepMemory(creep);
  // Do not overwrite exisitng task.
  if (!taskCreepMemory.task) {
    let room = creep.room;
    taskCreepMemory.task = task;
    moveTaskToAssigned(task, room);
  }
};
