import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
import * as memoryHelepr from "../../../common/memoryHelper";

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

      let plan = [
        {
          name: "withdrawEnergy",
          options: {
            nearestTo: memoryHelepr.toRoomPositionMemory(site.pos),
          },
        },
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

}
