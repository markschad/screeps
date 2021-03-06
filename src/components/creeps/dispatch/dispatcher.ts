import { log } from "../../support/log";

import * as creepTask from "./creepTask";
import * as creepTaskQueue from "./creepTaskQueue";
import * as routine from "./routine";
import { profiles } from "./profiles/index";

// import * as upgradeController from "./profiles/upgradeController";

/**
 * Dispatches the given creep, assigning it a new task if it is idle.
 */
export const run = (creep: Creep): void => {

  let creepTaskMemory = creepTask.getCreepTaskMemory(creep);

  let task = creepTaskMemory.task;

  // Find a task if this creep is idle.
  if (creepTaskMemory.state === creepTask.CreepTaskState.Idle) {

    // Try to find a compatible task.
    task = creepTaskQueue.findCompatible(creep);

    if (task) {

      log.info("Assigning task " + task.name + " to creep " + creep.name);

      creepTaskQueue.moveTaskToAssigned(task, creep.room);

      creepTaskMemory.task = task;
      task.assignedTo = creep.name;
      creepTaskMemory.currentRoutine = 0;
      creepTaskMemory.state = creepTask.CreepTaskState.Working;

      routine.setCurrentRoutineMemory(creep, task.routines[creepTaskMemory.currentRoutine]);
      creepTask.registerInteractions(task);
      creepTask.startRoutine(creep);

    }
  }

    // Execute the task for the creep if has a task.
  if (task && creepTaskMemory.state === creepTask.CreepTaskState.Working) {

    // Assign the routine to the creep's memory.
    let plan = task.routines[creepTaskMemory.currentRoutine];
    routine.setCurrentRoutineMemory(creep, plan);

    // Execute the current routine for the creep.
    let routineState = creepTask.executeRoutine(creep);

    // If the creep can't work, restart the task cycle.
    if (routineState === routine.RoutineState.CantWork) {
      creepTaskMemory.currentRoutine = 0;
    // If the creep is finished, advanced to the next routine.
    } else if (routineState === routine.RoutineState.Done) {

      creepTaskMemory.currentRoutine++;

      // If we're at the end of the list of plans, finish the task.
      let len = task.routines.length;
      if (creepTaskMemory.currentRoutine === len) {

        // Check if we can renew the task.
        let profile = profiles[task.name];
        if (profile.renew && profile.renew(creep)) {
          log.info("Renewing task " + task.name + " for " + creep.name);
          creepTaskMemory.state = creepTask.CreepTaskState.Working;
          creepTaskMemory.currentRoutine = 0;
        // Otherwise, unassign the current task.
      } else {
          log.info("Completing task " + task.name + " for " + creep.name);
          creepTaskQueue.removeTaskFromAssigned(task, creep.room);
          creepTaskMemory.state = creepTask.CreepTaskState.Idle;
          creepTaskMemory.task = null;
          creepTask.unregisterInteractions(task);
          return;
        }

      }

    }

    // Begin the next routine.
    routine.setCurrentRoutineMemory(creep, task.routines[creepTaskMemory.currentRoutine]);
    creepTask.startRoutine(creep);

  }

};

/**
 * Removes dead tasks from the list of assigned.
 */
export const cleanupMemory = () => {

  // Clear interactions.
  Memory.interactions = {};

  for (let name in Memory.rooms) {
    let roomMemory = Memory.rooms[name];
    let assigned = roomMemory.creepTaskAssigned as creepTask.CreepTask[];
    let tmp: creepTask.CreepTask[] = [];
    _.each(assigned, (task) => {
      if (task.assignedTo && Game.creeps[task.assignedTo]) {
        // Reregister interactions.
        creepTask.registerInteractions(task);
        tmp.push(task);
      } else {
        log.debug("Requeueing dead task " + task.name);
        task.assignedTo = null;
        roomMemory.creepTaskQueue.splice(0, 1, task);
      }
    });
    roomMemory.creepTaskAssigned = tmp;
  }

};
