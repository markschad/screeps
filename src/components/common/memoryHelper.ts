// import { log } from "../support/log";

/**
 * A representation of a room position that can be stored in memory.
 */
export interface RoomPositionMemory {
  x: number;
  y: number;
  room: string;
}

/**
 * Returns a room position memory object from a room position.
 *
 */
export const toRoomPositionMemory = (pos: RoomPosition): RoomPositionMemory => {
  return {
    room: pos.roomName,
    x: pos.x,
    y: pos.y,
  };
};

/**
 * Returns a room position from a room position memory object.
 */
export const toRoomPosition = (posMem: RoomPositionMemory | undefined): RoomPosition | undefined => {
  if (posMem === undefined) {
    return undefined;
  }
  return new RoomPosition(posMem.x, posMem.y, posMem.room);
};

export const checkMemory = () => {

  // Check memory for null or out of bounds custom objects
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  // Tasks
  if (!Memory.tasks) {
    Memory.tasks = {
      uuid: 0,
    };
  }

  // Interactions
  if (!Memory.interactions) {
    Memory.interactions = {};
  }

};

/**
 * Cleanup unused memory.
 */
export const cleanupMemory = () => {

  // Remove memory of inactive rooms.
  for (let name in Memory.rooms) {
    if (!Game.rooms[name]) {
      delete Memory.rooms[name];
    }
  }

};
