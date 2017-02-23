export interface RoleConfig {
  populationCap: number;
  priority: number;
  body: Array<string>;
};

export const roles: {[name: string]: RoleConfig} = {

  "harvester": {
    populationCap: 1,
    priority: 100,
    body: [ WORK, WORK, CARRY, MOVE ]
  },

  "assembler": {
    populationCap: 3,
    priority: 202,
    body: [ WORK, WORK, CARRY, MOVE ]
  },

  "constructor": {
    populationCap: 1,
    priority: 201,
    body: [ WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE ]
  },

  "worshipper": {
    populationCap: 1,
    priority: 300,
    body:[ WORK, WORK, CARRY, MOVE, CLAIM, CLAIM ]
  }

};
