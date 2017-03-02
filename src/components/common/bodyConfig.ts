/**
 * Represents a scalable body part.
 */
export interface BodyPartConfig {
  /**
   * The base number of this type of body part.
   */
  base: number;
  /**
   * The scaling factor of this body part.
   */
  scaleFactor: number;
}

/**
 * Represents a scalable body configuration.
 */
export interface BodyConfig {
  [bodyPart: string]: BodyPartConfig;
};

/**
 * Represents a body object of a creep.
 */
export interface BodyPart {
  boost: string | undefined;
  hits: number;
  type: string;
}

/**
 * Converts the given array of body parts into a body config object.
 */
export const toBodyConfig = (body: BodyPart[]): BodyConfig => {
  let bodyConfig: BodyConfig = {};
  let len = body.length;
  for (let i = 0; i < len; i++) {
    let bodyPart = body[i];
    let bodyPartConfig = bodyConfig[bodyPart.type] || (bodyConfig[bodyPart.type] = {
      base: 0,
      scaleFactor: 0,
    });
    bodyPartConfig.base++;
  }
  return bodyConfig;
};

/**
 * Creates a string array of body parts from the given body config for the purpose of spawning a
 * new creep.
 */
export const toBodyConstructor = (bodyConfig: BodyConfig, scale: number = 1): string[] => {
  let body: string[] = [];
  for (let type in bodyConfig) {
    let bodyPartConfig = bodyConfig[type];
    // Calculate the total number of this part the body should have.
    let num = Math.round(bodyPartConfig.base + bodyPartConfig.scaleFactor * scale);
    for (let i = 0; i < num; i++) {
      body.push(type);
    }
  }
  return body;
};
