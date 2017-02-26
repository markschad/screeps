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
  let maxRecruits = Math.min(queueLen, spawns.length);

  for (let i = 0; i < maxRecruits; i++) {

    let task = queue[i];
    let body: string[] | null = null;

    let spawn = spawns[i];

    let uuid = Memory.uuid++;
    let creepName: string = spawn.room.name + ":creep" + uuid;

    for (let multiplier = 3; multiplier > 0; multiplier--) {
      let possibleBody: string[];
      if (task.prereq.body) {
        possibleBody = creepTask.toBody(task.prereq.body, multiplier);
        log.debug("possibleBody length " + possibleBody);
      } else {
        possibleBody = [ CARRY, CARRY, MOVE, MOVE, WORK, WORK ]; // Basic utility.
      }
      if (spawn.canCreateCreep(possibleBody, creepName) === OK) {
        body = possibleBody;
        break;
      } else {
        log.debug("can't create");
      }
    }

    if (body) {
      log.debug("creating.");
      let result = spawn.createCreep(body, creepName, {});
      log.debug("createCreep result " + result);
    }

  }

}
