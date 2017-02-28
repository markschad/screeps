// import { log } from "../../../support/log";

import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
import * as memoryHelper from "../../../common/memoryHelper";
import * as energyHelper from "../../../common/energyHelper";

const TASK_NAME = "fillExtension";
const MAX_TASKS = 2;
const MAX_INTERACTIONS = 1;

export const run = (room: Room) => {

  let extensions = room.find(FIND_MY_STRUCTURES, {
    filter: (structure: Structure) => {
      if (structure.structureType === STRUCTURE_EXTENSION) {
        let extension = structure as Extension;
        return extension.energy < extension.energyCapacity;
      }
    },
  });

  let numTasks = creepTaskQueue.getNumQueuedOrActiveWithName(room, TASK_NAME);

  // Check the number of storeEnergy interactions there are against this energy store.
  _.each(extensions, (extension: StructureExtension) => {

    if (numTasks >= MAX_TASKS) {
      return true;
    }

    // If the number of interactions is less than the max, add a new task.
    let canEnqueue = numTasks < MAX_TASKS &&
      interactionsHelper.getInteractions(extension.id, "storeEnergy") < MAX_INTERACTIONS;

    if (canEnqueue) {

      let getEnergyRoutine: {
        name: string;
        options: {};
      };
      let energyStore = extension.pos.findClosestByRange<energyHelper.EnergyStore>(FIND_STRUCTURES, {
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
            nearestTo: memoryHelper.toRoomPositionMemory(extension.pos),
          },
        };
      }

      let plan = [
        getEnergyRoutine,
        {
          name: "storeEnergy",
          options: {
            energyStoreId: extension.id,
          },
        },
      ];

      let interactions: creepTask.CreepTaskInteractions = { };
      interactions[extension.id] = [ "storeEnergy" ];

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
