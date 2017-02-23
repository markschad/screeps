import * as creepActions from "../creepActions";

import * as harvester from "./harvester";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function animate(creep: Creep): void {

  let targetSite = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES)[0];

  // Fall back to the harvester role if there are no construction sites.
  if (targetSite === undefined) {
    return harvester.animate(creep);
  }

  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

  let energySource = creep.room.find<Source>(FIND_SOURCES_ACTIVE)[0];

  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, spawn);
  }
  else if (creepActions.canWork(creep)) {
    _moveToBuild(creep, targetSite)
  } else {
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
  if (_tryBuild(creep, target) === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}
