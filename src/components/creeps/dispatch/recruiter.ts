import { log } from "../../support/log";
import * as creepTask from "./creepTask";
import * as creepTaskQueue from "./creepTaskQueue";

const DEFAULT_BODY = [ CARRY, MOVE, WORK ];
const BODY_MULTIPLIER_START = 3;

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

    // Retrieve the next task in the queue.
    let task = queue[queueIndex++];
    let body: string[] | null = null;

    let spawn = spawns[spawnIndex];
    let creepName: string = "creep0";

    for (let multiplier = BODY_MULTIPLIER_START; multiplier > 0; multiplier--) {

      let possibleBody: string[];
      if (task.prereq.body) {
        possibleBody = creepTask.toBody(task.prereq.body, multiplier);
      } else {
        possibleBody = DEFAULT_BODY;
      }

      // Check if the creep can be created.
      let canCreate: number = OK;
      do {
        creepName = generateCreepName(spawn.room);
        canCreate = spawn.canCreateCreep(possibleBody, creepName);
      }
      while (canCreate === ERR_NAME_EXISTS);

      if (canCreate === OK) {
        body = possibleBody;
        break;
      }
    }

    // If a body has been assigned.
    if (body) {
      let tryCreate = spawn.createCreep(body, creepName, {});
      if (!tryCreate) {
        spawnIndex++;
        log.info("Spawned new creep " + creepName + " " + body);
      }
    } else {
      log.debug("Cannot spawn creep for task " + task.name + ", no body.");
    }

  }

};

/**
 * Generates a new creep name.
 */
export const generateCreepName = (room: Room): string => {
  return room.name + ":creep" + (Memory.uuid++);
};
