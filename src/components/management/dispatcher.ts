import * as bodyConfig from "../common/bodyConfig";
import * as tasks from "../tasks";
import * as routines from "../routines";

/**
 * Runs the dispatcher for the given creep.
 * @param creep The creep to dispatch.
 */
export const run = (creep: Creep) => {

  let taskCreepMemory = tasks.getTaskCreepMemory(creep);
  let routineMemory = routines.getRoutineMemory(creep);

  // If the creep is idle.
  if (taskCreepMemory.state === tasks.TaskState.Idle) {
    let task = dequeueNextCompatible(creep);
    if (task) {
      tasks.assignTaskToCreep(task, creep);
      setCurrentRoutineIndex(creep, 0);
      taskCreepMemory.state = tasks.TaskState.Working;
    }
  }

  // If the creep is working.
  if (taskCreepMemory.state === tasks.TaskState.Working) {
    // If we are working on the current routine run the routine.
    if (routineMemory.state === routines.RoutineState.Working) {
      routineRun(creep);
    }
    // If we are unable to work on the current routine for whatever reason, reset the index to 0.
    if (routineMemory.state === routines.RoutineState.CannotWork) {
      setCurrentRoutineIndex(creep, 0);
    }
    // If we have finished the current routine, finalise this routine and move on to the next one.
    if (routineMemory.state === routines.RoutineState.Done) {
      routineTeardown(creep);
      if (!incrementCurrentRoutineIndex(creep)) {
        taskCreepMemory.state = tasks.TaskState.Idle;
      }
    }
  }

};


/**
 * Retrieves the next compatible task from the queue for the given creep.
 */
export const dequeueNextCompatible = (creep: Creep) => {
  let queue = tasks.getQueuedTasks(creep.room);
  let queueLen = queue.length;
  for (let i = 0; i < queueLen; i++) {
    let task = queue[i];
    if (isCompatible(creep, task)) {
      return queue.splice(i, 1)[0];
    }
  }
  return null;
};

/**
 * Returns true if the given creep is compatible with the given task.
 */
export const isCompatible = (creep: Creep, task: tasks.TaskPlan) => {
  let taskConfig = task.prereq.body;
  if (taskConfig) {
    let creepConfig = bodyConfig.toBodyConfig(creep.body);
    // Test that body requirements are met.
    for (let type in creepConfig) {
      if (taskConfig[type] && taskConfig[type].base > creepConfig[type].base) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Increments the current routine index for the given creep.  This method also calls the setup
 * method for that routine.  Returns false if the current index exceeds the number of routines
 * in the task.
 * @param creep The creep for which the routine index should be incremented.
 */
const incrementCurrentRoutineIndex = (creep: Creep): boolean => {
  let taskCreepMemory = tasks.getTaskCreepMemory(creep);
  taskCreepMemory.currentPlanIndex++;
  if (taskCreepMemory.currentPlanIndex < taskCreepMemory.task.plans.length) {
    routineSetup(creep);
    return true;
  } else {
    return false;
  }
};

/**
 * Sets the current routine index of the given creep.
 * @param creep The creep for which to set the routine index.
 * @param index The index.
 */
const setCurrentRoutineIndex = (creep: Creep, index: number) => {
  let taskCreepMemory = tasks.getTaskCreepMemory(creep);
  taskCreepMemory.currentPlanIndex = index;
  routineSetup(creep);
};

/**
 * Runs the setup procedure for the current routine of the given creep.
 * @param creep The creep to setup.
 */
const routineSetup = (creep: Creep) => {
  let taskCreepMemory = tasks.getTaskCreepMemory(creep);
  let currentRoutine = taskCreepMemory.task.plans[taskCreepMemory.currentPlanIndex];
  if (currentRoutine) {
    let routineMemory = routines.getRoutineMemory(creep);
    routineMemory.plan = currentRoutine;
    routines.dictionary[currentRoutine.name].setup(creep);
    routineMemory.state = routines.RoutineState.Working;
  }
};

/**
 *
 * @param creep
 */
const routineRun = (creep: Creep) => {
  let taskCreepMemory = tasks.getTaskCreepMemory(creep);
  let currentRoutine = taskCreepMemory.task.plans[taskCreepMemory.currentPlanIndex];
  if (currentRoutine) {
    routines.dictionary[currentRoutine.name].run(creep);
  }
};

/**
 *
 * @param creep
 */
const routineTeardown = (creep: Creep) => {
  let taskCreepMemory = tasks.getTaskCreepMemory(creep);
  let currentRoutine = taskCreepMemory.task.plans[taskCreepMemory.currentPlanIndex];
  if (currentRoutine) {
    routines.dictionary[currentRoutine.name].teardown(creep);
  }
};

