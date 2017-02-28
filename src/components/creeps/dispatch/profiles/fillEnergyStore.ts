import { log } from "../../../support/log";

import * as energyHelper from "../../../common/energyHelper";
import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
import * as memoryHelper from "../../../common/memoryHelper";

const TASK_NAME = "fillEnergyStore";
const MAX_TASKS = 2;
const MAX_INTERACTIONS = 1;

export const run = (room: Room) => {

  let stores = room.find(FIND_STRUCTURES, {
    filter: energyHelper.isFillableEnergyStore,
  });

  log.debug("Num fillable energy stores: " + stores.length);

  let numTasks = creepTaskQueue.getNumQueuedOrActiveWithName(room, TASK_NAME);

  // Check the number of storeEnergy interactions there are against this energy store.
  _.each(stores, (store: energyHelper.EnergyStore) => {

    if (numTasks >= MAX_TASKS) {
      return true;
    }

    // If the number of interactions is less than the max, add a new task.
    let canEnqueue = numTasks < MAX_TASKS &&
      interactionsHelper.getInteractions(store.id, "storeEnergy") < MAX_INTERACTIONS;

    if (canEnqueue) {

      log.debug("Enquing fillEnergyStore task.");

      let plan = [
        {
          name: "gatherUntilFull",
          options: {
            nearestTo: memoryHelper.toRoomPositionMemory(store.pos),
          },
        },
        {
          name: "storeEnergy",
          options: {
            energyStoreId: store.id,
          },
        },
      ];

      let interactions: creepTask.CreepTaskInteractions = { };
      interactions[store.id] = [ "storeEnergy" ];

      let prereq: { body: creepTask.BodyConfig } = { body: {} };
      prereq.body[CARRY] = 1;
      prereq.body[MOVE] = 1;
      prereq.body[WORK] = 1;

      let fillEnergyStoreTask = creepTask.creepTaskFactory(plan, interactions, TASK_NAME, prereq);

      creepTaskQueue.enqueuePending(room, fillEnergyStoreTask);

      numTasks++;

    }

  });

};

/**
 * Attempts to renew the current task for the given
 */
export const renew = (creep: Creep) => {

  let taskMemory = creepTask.getCreepTaskMemory(creep);
  let task = taskMemory.task as creepTask.CreepTask;
  let energyStoreId: string = task.routines[1].options.energyStoreId;
  let energyStore = Game.getObjectById<energyHelper.EnergyStore>(energyStoreId);

  // If the energy store is not full, renew the task.
  if (energyStore && energyHelper.isFillableEnergyStore(energyStore)) {
    return true;
  }

  return false;

};

