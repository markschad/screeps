import * as Config from "../../config/config";

import { log } from "../support/log";

/**
 * Shorthand method for `Creep.moveTo()`.
 *
 * @export
 * @param {Creep} creep
 * @param {(Structure | RoomPosition)} target
 * @returns {number}
 */
export function moveTo(creep: Creep, target: Structure | RoomPosition): number {
  let result: number = 0;

  // Execute moves by cached paths at first
  result = creep.moveTo(target);

  return result;
}

/**
 * Returns true if the `ticksToLive` of a creep has dropped below the renew
 * limit set in config.
 *
 * @export
 * @param {Creep} creep
 * @returns {boolean}
 */
export function needsRenew(creep: Creep): boolean {
  return (creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
}

/**
 * Shorthand method for `renewCreep()`.
 *
 * @export
 * @param {Creep} creep
 * @param {Spawn} spawn
 * @returns {number}
 */
export function tryRenew(creep: Creep, spawn: Spawn): number {
  return spawn.renewCreep(creep);
}

/**
 * Moves a creep to a designated renew spot (in this case the spawn).
 *
 * @export
 * @param {Creep} creep
 * @param {Spawn} spawn
 */
export function moveToRenew(creep: Creep, spawn: Spawn): void {
  if (tryRenew(creep, spawn) === ERR_NOT_IN_RANGE) {
    creep.moveTo(spawn);
  }
}

/**
 * Attempts transferring available resources to the creep.
 *
 * @export
 * @param {Creep} creep
 * @param {RoomObject} roomObject
 */
export function getEnergy(creep: Creep, roomObject: RoomObject): void {
  let energy: Resource = <Resource> roomObject;

  if (energy) {
    if (creep.pos.isNearTo(energy)) {
      creep.pickup(energy);
    } else {
      moveTo(creep, energy.pos);
    }
  }
}

/**
 * Returns true if a creep's `working` memory entry is set to true, and false
 * otherwise.
 *
 * @export
 * @param {Creep} creep
 * @returns {boolean}
 */
export function canWork(creep: Creep): boolean {
  let working = creep.memory.working;
  if (working && _.sum(creep.carry) === 0) {
    log.info(creep.name + " is now ready to work.");
    creep.memory.working = false;
    return false;
  } else if (!working && _.sum(creep.carry) === creep.carryCapacity) {
    log.info(creep.name + " can no longer work.");
    creep.memory.working = true;
    return true;
  } else {
    return creep.memory.working;
  }
}

