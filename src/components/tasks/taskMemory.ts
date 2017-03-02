import { TaskPlan } from "./taskPlan";
import { TaskState } from "./taskState";

/**
 * Represents a map to the portion of memory dedicated to tasks.
 */
export interface TaskMemoryMap {
  rooms: {
    [roomName: string]: {
      tasks: TaskRoomMemory;
    };
  };
  creeps: {
    [creepName: string]: {
      tasks: TaskCreepMemory;
    };
  };
};

/**
 * Represents the portion of room memory dedicated to tasks.
 */
export interface TaskRoomMemory {
  assigned: TaskPlan[];
  queued: TaskPlan[];
};

/**
 * Represents the portion of creep memory dedication to tasks.
 */
export interface TaskCreepMemory {
  currentPlanIndex: number;
  state: TaskState;
  task: TaskPlan;
}

/**
 * Retrieves the task memory for the creep with the given name.
 */
export const getTaskCreepMemory = (creep: Creep): TaskCreepMemory => {
  let creepMemory = creep.memory;
  return creepMemory.tasks || (creepMemory.tasks = {
    currentPlan: 0,
    state: TaskState,
    task: null,
  });
};

/**
 * Retrieves the task memory for the room with the given name.
 */
export const getTaskRoomMemory = (room: Room): TaskRoomMemory => {
  let roomMemory = room.memory;
  return roomMemory.tasks || (roomMemory.tasks = {
    assigned: [],
    queued: [],
  });
};
