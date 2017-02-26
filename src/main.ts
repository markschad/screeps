// import * as CreepManager from "./components/creeps/creepManager";
import "./components/creeps/roles/roles";
import * as Config from "./config/config";
import * as memoryHelper from "./components/common/memoryHelper";

import * as profiler from "./components/creeps/dispatch/profiler";
import * as dispatcher from "./components/creeps/dispatch/dispatcher";
import * as recruiter from "./components/creeps/dispatch/recruiter";

import { log } from "./components/support/log";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// This is an example for using a config variable from `config.ts`.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

log.info("load");

/**
 * Clear all existing tasks.
 */
for (let name in Game.rooms) {
  let room = Game.rooms[name];
  delete room.memory.creepTaskAssigned;
}

_.each(Game.creeps, (creep) => {
  delete creep.memory.task;
});

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {

  memoryHelper.checkMemory();

  profiler.run();

  // Dispatch all creeps.
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    dispatcher.run(creep);
  }

  for (let i in Game.rooms) {
    let room: Room = Game.rooms[i];

    // CreepManager.run(room);

    recruiter.run(room);

    memoryHelper.cleanupMemory();
    dispatcher.cleanupMemory();

    // Clears any non-existing creep memory.
    for (let name in Memory.creeps) {
      let creep: any = Memory.creeps[name];

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          log.info("Clearing non-existing creep memory:", name);
          delete Memory.creeps[name];
        }
      }
    }
  }
}
