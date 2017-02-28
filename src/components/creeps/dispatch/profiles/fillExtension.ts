// import { log } from "../../../support/log";

import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
import * as memoryHelper from "../../../common/memoryHelper";
import * as energyHelper from "../../../common/energyHelper";

const TASK_NAME = "fillExtension";
const MAX_TASKS = 3;
const MAX_INTERACTIONS = 1;

export const run = (room: Room) => {

  let energyUsers = room.find(FIND_MY_STRUCTURES, {
    filter: (structure: Structure) => {
      if (energyHelper.isEnergyUser(structure)) {
        let energyUser = structure as energyHelper.EnergyUser;
        if (energyUser) {
          return energyUser.energy < energyUser.energyCapacity;
        } else {
          return false;
        }
      }
    },
  });

  let numTasks = creepTaskQueue.getNumQueuedOrActiveWithName(room, TASK_NAME);

  // Check the number of storeEnergy interactions there are against this energy store.
  _.each(energyUsers, (energyUser: energyHelper.EnergyUser) => {

    if (numTasks >= MAX_TASKS) {
      return true;
    }

    // If the number of interactions is less than the max, add a new task.
    let canEnqueue = numTasks < MAX_TASKS &&
      interactionsHelper.getInteractions(energyUser.id, "storeEnergy") < MAX_INTERACTIONS;

    if (canEnqueue) {

      let getEnergyRoutine: {
        name: string;
        options: {};
      };
      let energyStore = energyUser.pos.findClosestByRange<energyHelper.EnergyStore>(FIND_STRUCTURES, {
        filter: energyHelper.isEnergyStoreWithEnergy,
      });
      if (energyStore) {
        getEnergyRoutine = {
          name: "withdrawEnergy",
          options: {
            energyStoreId: energyStore.id,
          },
        };
      } else {
        getEnergyRoutine = {
          name: "gatherUntilFull",
          options: {
            nearestTo: memoryHelper.toRoomPositionMemory(energyUser.pos),
          },
        };
      }

      let plan = [
        getEnergyRoutine,
        {
          name: "storeEnergy",
          options: {
            energyStoreId: energyUser.id,
          },
        },
      ];

      let interactions: creepTask.CreepTaskInteractions = { };
      interactions[energyUser.id] = [ "storeEnergy" ];

      let prereq: { body: creepTask.BodyConfig } = { body: {} };
      prereq.body[CARRY] = 1;
      prereq.body[MOVE] = 1;
      prereq.body[WORK] = 1;

      let fillExtensionTask = creepTask.creepTaskFactory(plan, interactions, TASK_NAME, prereq);

      creepTaskQueue.enqueuePending(room, fillExtensionTask);

      numTasks++;

    }

  });

};
