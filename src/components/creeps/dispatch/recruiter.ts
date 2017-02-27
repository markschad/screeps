import { log } from "../../support/log";
import * as creepTask from "./creepTask";
import * as creepTaskQueue from "./creepTaskQueue";

/**
 * Attempts to spawn a creep to meet the needs of each task in
 * the given room's queue.
 */
export const run = (room: Room) => {

  // Get the spawn for this room that aren't currently spawning.
  let spawns = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: {
      spawning: null,
    },
  });

  // Finish if there's no available spawns.
  let spawnsLen = spawns.length;
  if (spawnsLen === 0) {
    return;
  }

  let queue = creepTaskQueue.getQueue(room);
  let queueLen = queue.length;

  let queueIndex = 0;
  let spawnIndex = 0;

  while (queueIndex < queueLen && spawnIndex < spawnsLen) {

    let task = queue[queueIndex++];
    let body: string[] | null = null;

    let spawn = spawns[spawnIndex];

    let uuid = Memory.uuid++;
    let creepName: string = spawn.room.name + ":creep" + uuid;

    for (let multiplier = 3; multiplier > 0; multiplier--) {
      let possibleBody: string[];
      if (task.prereq.body) {
        possibleBody = creepTask.toBody(task.prereq.body, multiplier);
      } else {
        possibleBody = [ CARRY, MOVE, WORK ]; // Basic utility.
      }
      if (!spawn.canCreateCreep(possibleBody, creepName)) {
        body = possibleBody;
        break;
      }
    }

    if (body) {
      log.debug("creating.");
      let result = spawn.createCreep(body, creepName, {});
      if (!result) {
        spawnIndex++;
        log.debug("createCreep result " + result);
      }
    } else {
      log.debug("Can't create creep for task " + task.name);
    }

  }

}
