import {Vec4} from "./utils/mathObjects.js";
import * as global from "./GLOBALs.js";
import {mTrackballCamera, mPanner,
    mModeler, zIndexFilter} from "./GLOBALs.js";


class Transformation {

    constructor() {
        this.reCalcProjection = true;
        this.x1m = 0;
        this.x2m = 0;
        this.y1m = 0;
        this.y2m = 0;
        this.z1m = 0;
        this.z2m = 0;
        this.w1m = 0;
    }

    /*perspective projection matrix transformation
    * */
    perspectiveProjection(vec4, aspectRatio, fovHalf = 45, near = .1, far = 500) {

        if (this.getProjectionRecalc()) {
            /*recalculate*/
            let top = Math.tan(fovHalf) * near;
            let right = aspectRatio * top;
            let bottom = -top;
            let left = -top * aspectRatio;

            /*x and y multipliers saved for optimization*/
            this.x1m = (2 * near) / (right - left);
            this.x2m = (right + left) / (right - left);

            this.y1m = (2 * near) / (top - bottom);
            this.y2m = (top + bottom) / (top - bottom);

            this.z1m = (-(far + near)) / (far - near);
            this.z2m = (-2 * (far * near)) / (far - near);

            this.w1m = -1;/*always -1 for NDC division*/
            this.disableProjectionRecalc();

        }

        /*return clip space coordinates*/

        vec4.setX((this.x1m * vec4.x) + (this.x2m * vec4.z));
        vec4.setY((this.y1m * vec4.y) + (this.y2m * vec4.z));
        vec4.setZ((this.z1m * vec4.z) + (this.z2m * vec4.w));
        vec4.setW(this.w1m * vec4.z);

        return vec4;

    }


    ndcTransform(vec4) {
        let wValue = vec4.w;
        vec4.setX((vec4.x / wValue));
        vec4.setY((vec4.y / wValue));
        vec4.setZ(vec4.z / wValue);
        vec4.setW(vec4.w / wValue);
        return vec4;
    }

    disableProjectionRecalc() {
        this.reCalcProjection = false;
    }

    enableProjectionRecalc() {
        this.reCalcProjection = true;
    }

    getProjectionRecalc() {
        return this.reCalcProjection;
    }

    screenTransform(vec4) {
        vec4.setX((vec4.x * global.WIDTH) + global.WIDTH / 2);/*translate to center of the screen*/
        vec4.setY((vec4.y * global.HEIGHT) + global.HEIGHT / 2);

        return vec4;
    }

    rotate(vec4) {

    }


    /*
    * takes in a vec4 object and
    * transforms it through the rendering pipeline;
    * vec4 come from the model space
    * */
    pipeline(vec4In, vec4Out, captureBuffer, captureBufferPosition) {
        return this.screenTransform(
            this.ndcTransform(
                this.perspectiveProjection(
                    zIndexFilter.capture(captureBuffer,
                        mPanner.pan(
                            mTrackballCamera.viewTransform(
                                mModeler.modelTransform(vec4In, vec4Out), vec4Out)), captureBufferPosition),
                    global.WIDTH / global.HEIGHT)
            )
        );
    }


    /*
    * takes an array of vec4 and transforms them through the pipeline
    * captureBuffer is used to capture view space coordinates.
    * */

    pipelineTransform(vec4ArrIn, vec4ArrOut, fvis, fzis, captureBuffer) {

        for (let i = 0; i < vec4ArrIn.length; i++) {
            this.pipeline(vec4ArrIn[i], vec4ArrOut[i], captureBuffer, i);
        }

        /* view space coordinates have been captured at this point */
        /* proceed with face index sorting */


        /*TODO - user event optimization can be done here*/
        let tempMax = 0;
        let fviVertexValue = 0;
        let fvi = []; /*current fvi*/

        for (let k = 0; k < fvis.length; k++) {

            fvi = fvis[k];
            tempMax = captureBuffer[fvi[0]].z;
            for (let i = 1; i < fvi.length; i++) {/*fi is */
                fviVertexValue = captureBuffer[fvi[i]].z;
                /* get the maximum z-value of vertices making the face */
                tempMax = (tempMax > fviVertexValue) ? tempMax : fviVertexValue;
            }

            fzis[ k ].zIndex = tempMax;
        }

        /*face zIndex sort*/
        fzis.sort( (a, b) => a.zIndex > b.zIndex ? 1 : -1 );


    }


}


var xMan = 0;






class ModelTransformations{

    constructor(){
        this.yRotation = 0;
        this.xRotation = 0;
    }

    rotateY(vec4In, vec4Out){
        vec4Out.x = (Math.cos(this.yRotation) * vec4In.x) + (Math.sin(this.yRotation) * vec4In.z);
        vec4Out.y = vec4In.y
        vec4Out.z = (vec4In.x * (-Math.sin(this.yRotation))) + (Math.cos(this.yRotation) * vec4In.z);
        return vec4Out;
    }

    /*
    * accumulates the rotation in the input vector object
    * */
    rotateXAccumulate(vec4In) {
        /*x axis remains unchanged*/
        vec4In.y = (Math.cos(this.xRotation) * vec4In.y) - (Math.sin(this.xRotation) * vec4In.z);
        vec4In.z = (Math.sin(this.xRotation) * vec4In.y) + (Math.cos(this.xRotation) * vec4In.z);
        return vec4In;
    }

    /*
    * rotateY affector function
    * */
    rotY(fac){
        this.yRotation += fac;
    }

    rotX(fac){
        this.xRotation += fac;
    }

    /* model space transformations */
    modelTransform(vec4In, vec4Out){
        return this.rotateXAccumulate(
            this.rotateY(vec4In, vec4Out) );
    }

}



export {Transformation, ModelTransformations};