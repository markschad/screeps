import { log } from "../../support/log";
import { profiles } from "./profiles/index";

/**
 * Runs each profiler in each room in which we have access.
 */
export const run = () => {

  _.each(Game.rooms, (room) => {

   for (let name in profiles) {

    log.debug("Running profiler " + name);

    let profiler = profiles[name];
    profiler.run(room);

   }

  });

}
