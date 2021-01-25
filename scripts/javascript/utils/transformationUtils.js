import {Vec4} from "./mathObjects.js";

class TransformUtils{
    constructor(){

    }

    /*
    * takes two vec4 vectors and returns the cross product;
    * */
    static crossProduct(aVec4, bVec4){
        return new Vec4(
                        (aVec4.y * bVec4.z) - (aVec4.z * bVec4.y),
                        (aVec4.z * bVec4.x) - (aVec4.x * bVec4.z),
                        (aVec4.x * bVec4.y) - (aVec4.y *bVec4.x)
                        );
    }

    static dotProduct(aVec4, bVec4){
        return (aVec4.x * bVec4.x) + (aVec4.y * bVec4.y) + (aVec4.z * bVec4.z);
    }


    /*
    * subtract(a, b): a_vector - b_vector
    * */
    static subtract(aVec4, bVec4){
        return new Vec4(
                        (aVec4.x - bVec4.x),
                        (aVec4.y - bVec4.y),
                        (aVec4.z - bVec4.z)
        );
    }

    /*
    * add(a, b): a_vector + b_vector
    * */
    static add(aVec4, bVec4){
        return new Vec4(
                        (aVec4.x + bVec4.x),
                        (aVec4.y + bVec4.y),
                        (aVec4.z + bVec4.z)
        );
    }

    static scale(scaleFactor, aVec4){
        return new Vec4(
               scaleFactor * aVec4.x,
               scaleFactor * aVec4.y,
               scaleFactor * aVec4.z
        );
    }
}

export {TransformUtils};