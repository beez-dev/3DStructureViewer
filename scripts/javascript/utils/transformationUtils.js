import {Vec4} from "./mathObjects.js";

class Transform {
    constructor(){

    }

    /*
    * takes two vec4 vectors and returns the cross product;
    * only x, y, and z coordinates are taken account, the w coord is ignored
    * */
    static crossProduct(aVec4, bVec4) {
        return new Vec4(
            (aVec4.y * bVec4.z) - (aVec4.z * bVec4.y),
            (aVec4.z * bVec4.x) - (aVec4.x * bVec4.z),
            (aVec4.x * bVec4.y) - (aVec4.y * bVec4.x)
        );
    }

    /*
    * takes two vec4 vectors and returns the cross product;
    * only x, y, and z coordinates are taken account, the w coord is ignored
    * */
    static dotProduct(aVec4, bVec4) {
        return (aVec4.x * bVec4.x) + (aVec4.y * bVec4.y) + (aVec4.z * bVec4.z);
    }



    /*
    * subtract(a, b): a_vector - b_vector
    * */
    static subtract(aVec4, bVec4) {
        return new Vec4(
            (aVec4.x - bVec4.x),
            (aVec4.y - bVec4.y),
            (aVec4.z - bVec4.z)
        );
    }


    /*
    * add(a, b): a_vector + b_vector
    * */
    static add(aVec4, bVec4) {
        return new Vec4(
            (aVec4.x + bVec4.x),
            (aVec4.y + bVec4.y),
            (aVec4.z + bVec4.z)
        );
    }

    /*
    * add the vectors aVec4 and bVec4 and
    * accumulate the result back to aVec4
    * */
    static addAccumulate(aVec4, bVec4){
        aVec4.x = aVec4.x + bVec4.x;
        aVec4.y = aVec4.y + bVec4.y;
        aVec4.z = aVec4.z + bVec4.z;
        return aVec4;
    }


    static scale(scaleFactor, aVec4) {
        return new Vec4(
            scaleFactor * aVec4.x,
            scaleFactor * aVec4.y,
            scaleFactor * aVec4.z
        );
    }

    /* normalizes homogeneous 4D coordinates
    * NOTE, this changes the original vector
    *  */
    static hNormalizeVec4(vec4){
      let magnitude = vec4.getIMagnitude(Vec4.wIndex); /*the wCoordinate remains untouched*/
      vec4.x = vec4.x/magnitude;
      vec4.y = vec4.y/magnitude;
      vec4.z = vec4.z/magnitude;

      return vec4;
    }

}

export {Transform};