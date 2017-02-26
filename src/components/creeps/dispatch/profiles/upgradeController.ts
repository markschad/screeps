// import * as interactionsHelper from "../../../common/interactions";
import * as creepTask from "../creepTask";
import * as creepTaskQueue from "../creepTaskQueue";
// import * as memoryHelepr from "../../../common/memoryHelper";

// Max interactions increases by one for
const TASK_NAME = "upgradeController";
const MAX_TASKS = 1;

export const run = (room: Room) => {

  let canEnqueue = creepTaskQueue.getQueue(room).length + creepTaskQueue.getAssigned(room).length < MAX_TASKS;
  // let canEnqueue = creepTaskQueue.getNumQueuedOrActiveWithName(room, TASK_NAME) < MAX_TASKS;

  // If the number of interactions is less than the calculated max, add a new task.
  if (canEnqueue) {

    let plan = [
      {
        name: "withdrawEnergy",
        options: {},
      },
      {
        name: "upgradeController",
        options: {},
      },
    ];

    let prereq: { body: creepTask.BodyConfig } = { body: {} };
    prereq.body[CARRY] = 1;
    prereq.body[MOVE] = 1;
    prereq.body[WORK] = 1;

    let interactions: creepTask.CreepTaskInteractions = {};

    let task = creepTask.creepTaskFactory(plan, interactions, TASK_NAME, prereq);
    creepTaskQueue.enqueuePending(room, task);

  }

}
