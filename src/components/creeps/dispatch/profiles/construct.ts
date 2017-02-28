import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
// import * as memoryHelepr from "../../../common/memoryHelper";
import * as energyHelper from "../../../common/energyHelper";

// Max interactions increases by one for
const RESOURCE_INTERACTION_STEP = 500;
const TASK_NAME = "construct";
const MAX_TASKS = 3;

export const run = (room: Room) => {

  let sites = room.find(FIND_CONSTRUCTION_SITES);
  let numTasks = creepTaskQueue.getNumQueuedOrActiveWithName(room, TASK_NAME);

  // Check the number of construct interactions there area gainst this store.
  _.each(sites, (site: ConstructionSite) => {

    if (numTasks >= MAX_TASKS) {
      return true;
    }

    let maxInteractions = Math.ceil(site.progressTotal / RESOURCE_INTERACTION_STEP);

    let canEnqueue = numTasks < MAX_TASKS &&
      interactionsHelper.getInteractions(site.id, "construct") < maxInteractions;

    // If the number of interactions is less than the calculated max, add a new task.
    if (canEnqueue) {

      let getEnergyRoutine: {
        name: string;
        options: {};
      };
      let energyStore = site.pos.findClosestByRange<energyHelper.EnergyStore>(FIND_MY_STRUCTURES, {
        filter: energyHelper.isEnergyStoreWithEnergy,
      });
      let energySource = site.pos.findClosestByRange<Source>(FIND_SOURCES_ACTIVE);
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
            energySourceId: energySource.id,
          },
        };
      }

      let plan = [
        getEnergyRoutine,
        {
          name: "construct",
          options: {
            constructionSiteId: site.id,
          },
        },
      ];

      let prereq: { body: creepTask.BodyConfig } = { body: {} };
      prereq.body[CARRY] = 1;
      prereq.body[MOVE] = 1;
      prereq.body[WORK] = 1;

      let interactions: creepTask.CreepTaskInteractions = {};
      interactions[site.id] = [ "construct" ];

      let task = creepTask.creepTaskFactory(plan, interactions, TASK_NAME, prereq);
      creepTaskQueue.enqueuePending(room, task);

      numTasks++;

    }

  });

};

/**
 * Attempts to renew the current task for the given creep.
 */
export const renew = (creep: Creep) => {

  let taskMemory = creepTask.getCreepTaskMemory(creep);
  let task = taskMemory.task as creepTask.CreepTask;
  let siteId: string = task.routines[1].options.constructionSiteId;
  let site = Game.getObjectById<ConstructionSite>(siteId);

  // If the energy store is not full, renew the task.
  if (site && site.progress < site.progressTotal) {
    return true;
  }

  return false;

};
