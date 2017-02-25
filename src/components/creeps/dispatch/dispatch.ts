import * as creepTask from "./creepTask";
import * as creepTaskQueue from "./creepTaskQueue";
import * as routine from "./routine";

/**
 * Dispatches the given creep, assigning it a new task if it is idle.
 */
export const dispatch = (creep: Creep): void => {

  let creepTaskMemory = creepTask.getCreepTaskMemory(creep);

  // Find a task if this creep is idle.
  if (creepTaskMemory.state == creepTask.CreepTaskState.Idle) {
    creepTaskQueue.findCompatible(creep);
  }

  // Execute the current routine for the creep.
  if (routine.executeCurrentRoutine(creep)) {
    creepTaskMemory.state = creepTask.CreepTaskState.Idle;
  }

};




