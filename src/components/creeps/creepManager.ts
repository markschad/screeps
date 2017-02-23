import * as Config from "../../config/config";

import { roles, RoleConfig } from "./roles/roles";

import * as harvester from "./roles/harvester";
import * as creator from "./roles/creator";
import * as worshipper from "./roles/worshipper";

import { log } from "../../components/support/log";

export let creeps: Creep[];
export let creepCount: number = 0;

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  _loadCreeps(room);
  _buildMissingCreeps(room);

  _.each(creeps, (creep: Creep) => {

    let role = creep.memory.role;
    log.info("assigning tasks for creep: " + creep.name + " with role: " + creep.memory.role);

    switch (role) {

      case "harvester":
        harvester.animate(creep);
        break;

      case "assembler":
      case "constructor":
        creator.animate(creep);
        break;

      case "worshipper":
        worshipper.animate(creep);
        break;

    }

  });
}

/**
 * Loads and counts all available creeps.
 *
 * @param {Room} room
 */
function _loadCreeps(room: Room) {
  creeps = room.find<Creep>(FIND_MY_CREEPS);
  creepCount = _.size(creeps);

  if (Config.ENABLE_DEBUG_MODE) {
    log.info(creepCount + " creeps found in the playground.");
  }
}

/**
 * Creates a new creep if we still have enough space.
 *
 * @param {Room} room
 */
function _buildMissingCreeps(room: Room) {

  let spawns: Spawn[] = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: (spawn: Spawn) => {
      return spawn.spawning === null;
    },
  });

  if (Config.ENABLE_DEBUG_MODE) {
    if (spawns[0]) {
      log.info("Spawn: " + spawns[0].name);
    }
  }

  for (let name in roles) {

    let role: RoleConfig = roles[name];

    let population: Array<Creep> = _.filter(creeps,
      (creep) => creep.memory.role === name
    );

    if (population.length < role.populationCap) {
      _.each(spawns, (spawn: Spawn) => {
        _spawnCreep(spawn, name, role);
      });
    }

  }

}


/**
 * Spawns a new creep.
 *
 * @param {Spawn} spawn
 * @param {string[]} bodyParts
 * @param {string} role
 * @returns
 */
function _spawnCreep(spawn: Spawn, name: string, role: RoleConfig) {
  let uuid: number = Memory.uuid;

  let bodyParts: string[] = role.body;

  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

  let mem: { [key: string]: any } = {
    role: name,
    room: spawn.room.name,
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    let creepName: string = spawn.room.name + " - " + name + uuid;

    log.info("Started creating new creep: " + creepName);
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Body: " + bodyParts);
    }

    status = spawn.createCreep(bodyParts, creepName, mem);

    return _.isString(status) ? OK : status;
  } else {
    if (Config.ENABLE_DEBUG_MODE) {
      log.info("Failed creating new creep: " + status);
    }

    return status;
  }
}
