import * as memoryHelper from "../common/memoryHelper";

export interface CreepPathMemory {
  target: memoryHelper.RoomPositionMemory;
  path: string;
};

/**
 * Retrieves the creep's path memory or initialises it.
 */
export const getCreepPathMemory = (creep: Creep): CreepPathMemory => {
  return creep.memory.path || (creep.memory.path = {
    path: null,
    target: null,
  });
};

/**
 * Sets the path target for the given creep and creates a new path.
 */
export const setPathTarget = (creep: Creep, targetPos: RoomPosition) => {
  let pathMemory = getCreepPathMemory(creep);
  pathMemory.target = memoryHelper.toRoomPositionMemory(targetPos);
  resetPath(creep);
};

/**
 * Creates a new path to the current target of the given creep.
 */
export const resetPath = (creep: Creep) => {
  let pathMemory = getCreepPathMemory(creep);
  let targetPos = memoryHelper.toRoomPosition(pathMemory.target) as RoomPosition;
  let path = creep.pos.findPathTo(targetPos);
  pathMemory.path = Room.serializePath(path);
};

/**
 * Executes the current path for the given creep.  The path will be recalculated if an error
 * is received.
 */
export const executePath = (creep: Creep) => {
  let pathMemory = getCreepPathMemory(creep);
  let tryMove = creep.moveByPath(pathMemory.path);
  switch (tryMove) {
    case ERR_NOT_FOUND:
      resetPath(creep);
      break;
    case OK:
    default:
      // OK.
  }
};
