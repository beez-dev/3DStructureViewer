/*simulated depth-based rendering */

import {TransformUtils} from "./utils/transformationUtils.js";

class ZIndexFilter {
    constructor(){

    }

    /* stores the vec4's value not a reference;
    *  and passes the input vector as is;
    *  intervenes in the rendering pipeline so
    *  cannot save a direct reference as it is
    *  modified further down the pipeline
    *
    * captureBuffer must be an array of vec4s */
    capture(captureBuffer, vec4, bufferPosition){
        TransformUtils.copy(captureBuffer[bufferPosition], vec4);
        return vec4;
    }
}


/* FZI - Face to Z index hash like mapper */
class FZI{
    static staticFaceIndex = 0;
    constructor(){
        this.FaceZIndex = 0;
        this.faceIndex = FZI.staticFaceIndex;
        FZI.staticFaceIndex += 1;
    }

    resetFaceIndex(){
        FZI.staticFaceIndex = 0;
    }

    get zIndex(){
        return this.FaceZIndex;
    }

    set zIndex(indexValue) {
        this.FaceZIndex = indexValue;
    }

    /*get the face Index*/
    get fIndex(){
        return this.faceIndex;
    }

    /*set the face index*/
    set fIndex(indexValue){
        this.faceIndex = indexValue;
    }

}

export {ZIndexFilter, FZI};