import { Routine } from "../routine";

import * as gatherResource from "./gatherResource";

/**
 * A collection of routines.
 */
export const dictionary: { [routineName: string]: Routine } = {

  gatherResource: gatherResource,

};
