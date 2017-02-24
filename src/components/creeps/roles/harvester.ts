import * as creepActions from "../creepActions";
import * as energy from "../../common/energy";

import { log } from "../../support/log";


/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep
 */
export function animate(creep: Creep): void {
  let spawn = creep.room.find<Spawn>(FIND_MY_SPAWNS)[0];

  let currentCarry = _.sum(creep.carry);
  log.info(creep.name + " carry: " + currentCarry + " / " + creep.carryCapacity);

  if (creepActions.needsRenew(creep)) {
    creepActions.moveToRenew(creep, spawn);
  }
  else if (creepActions.canWork(creep)) {
    log.info(creep.name + "moveToDrop");
    _moveToDropEnergy(creep, energy.findNearestFillableEnergyStore(creep.pos) as Structure);
  }
  else {
    let energySource = creep.pos.findClosestByPath<Source>(FIND_SOURCES_ACTIVE);
    log.info(creep.name + " moveToHarvest");
    _moveToHarvest(creep, energySource);
  }
}

function _tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void {
  let result = _tryHarvest(creep, target);
  log.info(creep.name + " tryHarvest = " + result);
  if (result === ERR_NOT_IN_RANGE) {
    creepActions.moveTo(creep, target.pos);
  }
}

function _tryEnergyDropOff(creep: Creep, target: Spawn | Structure): number {
  let storageStructure: StructureSpawn = target as StructureSpawn;
  log.info(storageStructure.energy + " / " + storageStructure.energyCapacity);
  if (storageStructure && storageStructure.energy < storageStructure.energyCapacity) {
    return creep.transfer(target, RESOURCE_ENERGY);
  } else {
    return ERR_FULL;
  }
}

function _tryUpgradeController(creep: Creep, target: StructureController) {

  return creep.upgradeController(target);
}


/** */
function _moveToDropEnergy(creep: Creep, target: Spawn | Structure): void {
  log.info("[" + creep.name + "] moveToDropEnergy");
  let result = _tryEnergyDropOff(creep, target);
  if (result === ERR_NOT_IN_RANGE) {
    log.info("not in range.");
    creepActions.moveTo(creep, target.pos);
  }
  else if (result === ERR_FULL) {
    log.info("Spawn is full.  Upgrading controller.");
    let controller: StructureController = creep.room.controller as StructureController;
    if (_tryUpgradeController(creep, controller) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, controller);
    };
  }
}
