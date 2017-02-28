import { log } from "../../support/log";
import { profiles } from "./profiles/index";

export const throttle = (freq: number): boolean => {

  let profilerMemory = Memory.profiler || (Memory.profiler = {});
  let tick = profilerMemory.tick || (profilerMemory.tick = 0);
  if (tick >= freq) {
    profilerMemory.tick = 0;
    return true;
  } else {
    profilerMemory.tick++;
    return false;
  }

};

/**
 * Runs each profiler in each room in which we have access.
 */
export const run = () => {

  _.each(Game.rooms, (room) => {

   for (let name in profiles) {

    log.info("Running profiler " + name);

    let profiler = profiles[name];
    profiler.run(room);

   }

  });

};
