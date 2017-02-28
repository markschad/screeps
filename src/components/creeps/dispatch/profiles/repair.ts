import { log } from "../../../support/log";

import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
// import * as memoryHelepr from "../../../common/memoryHelper";
import * as energyHelper from "../../../common/energyHelper";

// Max interactions increases by one for
const TASK_NAME = "repair";
const MAX_TASKS = 1;
const MAX_INTERACTIONS = 1;
const REPAIR_THRESHOLD = 0.3;

export const run = (room: Room) => {

  let structures = room.find<Structure>(FIND_STRUCTURES, {
    filter: (s: Structure) => {
      return s.hits / s.hitsMax < REPAIR_THRESHOLD;
    },
  });

  let numTasks = creepTaskQueue.getNumQueuedOrActiveWithName(room, TASK_NAME);

  log.info("Repairable structures: " + structures.length);

  // Check the number of construct interactions there area gainst this store.
  _.each(structures, (structure: Structure) => {

    if (numTasks >= MAX_TASKS) {
      return true;
    }

    let canEnqueue = numTasks < MAX_TASKS &&
      interactionsHelper.getInteractions(structure.id, "repair") < MAX_INTERACTIONS;

    // If the number of interactions is less than the calculated max, add a new task.
    if (canEnqueue) {

      let getEnergyRoutine: {
        name: string;
        options: {};
      };
      let energyStore = structure.pos.findClosestByRange<energyHelper.EnergyStore>(FIND_MY_STRUCTURES, {
        filter: energyHelper.isEnergyStoreWithEnergy,
      });
      let energySource = structure.pos.findClosestByRange<Source>(FIND_SOURCES_ACTIVE);
      if (energyStore && structure.pos.getRangeTo(energyStore) < structure.pos.getRangeTo(energySource)) {
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
            energySourceId: energySource.id,
          },
        };
      }

      let plan = [
        getEnergyRoutine,
        {
          name: "repair",
          options: {
            structureId: structure.id,
          },
        },
      ];

      let prereq: { body: creepTask.BodyConfig } = { body: {} };
      prereq.body[CARRY] = 1;
      prereq.body[MOVE] = 1;
      prereq.body[WORK] = 1;

      let interactions: creepTask.CreepTaskInteractions = {};
      interactions[structure.id] = [ "repair" ];

      let task = creepTask.creepTaskFactory(plan, interactions, TASK_NAME, prereq);
      creepTaskQueue.enqueuePending(room, task);

      numTasks++;

    }

  });

};
