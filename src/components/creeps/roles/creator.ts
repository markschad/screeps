import * as creepActions from "../creepActions";

import * as harvester from "./harvester";

import { log } from "../../support/log";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function animate(creep: Creep): void {

  let targetSite: ConstructionSite = creep.pos.findClosestByPath<ConstructionSite>(FIND_CONSTRUCTION_SITES);
  // Fall back to the harvester role if there are no construction sites.
  if (targetSite === undefined) {
    log.debug("No constructions sites.");
    return harvester.animate(creep);
  }

  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, spawn);
  }
  else if (creepActions.canWork(creep)) {
    log.info("Moving to build.");
    _moveToBuild(creep, targetSite);
  } else {
    log.info("Moving to harvest.");
    let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    _moveToHarvest(creep, energySource);
  }
}

function _tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void {
  if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

function _tryBuild(creep: Creep, target: ConstructionSite): number {
  return creep.build(target);
}

function _moveToBuild(creep: Creep, target: ConstructionSite): void {
  let result = _tryBuild(creep, target);
  if (result === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}
