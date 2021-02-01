import {Vec4} from "./utils/mathObjects.js";
import * as global from "./init.js";
import {
    mainCamera, panner,
    modeler, zIndexFilter, State
    } from "./init.js";
import {Convert} from "./utils/utils.js";


class Transformation {

    constructor() {
        this.reCalcPerspectiveProjection  = true; /* true enables first calculation*/
        this.reCalcOrthographicProjection = true; /* true enables first calculation*/
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
    perspectiveProjection(vec4, aspectRatio= (global.WIDTH / global.HEIGHT),
                          fovHalf = 45, near = .1, far = 500) {

        if( State.perspectiveEnabled ) {
            if (State.getPerspProjectionRecalc()) {
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
                State.disablePerspProjectionRecalc();
            }

            /*return clip space coordinates*/
            vec4.x = (this.x1m * vec4.x) + (this.x2m * vec4.z);
            vec4.y = (this.y1m * vec4.y) + (this.y2m * vec4.z);
            vec4.z = (this.z1m * vec4.z) + (this.z2m * vec4.w);
            vec4.w = (this.w1m  * vec4.z);
        }

        return vec4;

    }


    orthographicProjection( vec4, aspectRatio = (global.WIDTH / global.HEIGHT),
                           fovHalf = 45, near = .1, far = 500 ){
        if( State.orthographicEnabled ){
            if ( State.getOrthoProjectionRecalc() ) {
                /*recalculate*/
                /*let top = Math.tan(fovHalf) * near;
                let right = aspectRatio * top;
                let bottom = -top;
                let left = -top * aspectRatio;

                /!*x and y multipliers saved for optimization*!/
                this.x1m = 2  / (right - left);
                this.x2m = (right + left) / (left - right);

                this.y1m = 2  / (top - bottom);
                this.y2m = (top + bottom) / (bottom - top);

                this.z1m = 2 / ( near - far);
                this.z2m = (far + near) / (near- far);

                this.w1m = 1;
                State.disableOrthoProjectionRecalc();*/


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
                State.disableOrthoProjectionRecalc();

            }

            vec4.x = (this.x1m * vec4.x) + (this.x2m);
            vec4.y = (this.y1m * vec4.y) + (this.y2m);
            vec4.z = (this.z1m * vec4.z) + (this.z2m);
            vec4.w = -1;
        }


        return vec4;
    }

    ndcTransform(vec4) {
        let wValue = vec4.w;
        vec4.setX((vec4.x / wValue));
        vec4.setY((vec4.y / wValue));
        vec4.setZ((vec4.z / wValue));
        vec4.setW((vec4.w / wValue));
        return vec4;
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
                this.orthographicProjection(
                    this.perspectiveProjection(
                        zIndexFilter.capture(captureBuffer,
                            panner.pan(
                                mainCamera.viewTransform(
                                    modeler.modelTransform(vec4In, vec4Out), vec4Out)), captureBufferPosition)
                    )
                )
            )
        );
    }


    /*
    * takes an array of vec4 and transforms them through the pipeline
    * captureBuffer is used to capture view space coordinates.
    * */

    pipelineTransform(vec4ArrIn, vec4ArrOut, captureBuffer) {


        for (let i = 0; i < vec4ArrIn.length; i++) {
            this.pipeline(vec4ArrIn[i], vec4ArrOut[i], captureBuffer, i);
        }

        /* view space coordinates have been captured at this point */
        /* proceed with face index sorting */
        /*TODO - user event optimization can be done here*/


    }


}



class ModelTransformations{

    constructor(){
        this.yRotation = 0;
        this.xRotation = 0;
        this.autoRotation = false;
        this.autoRotateAnimationID = -1;
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


    /* scales the vector input pointed
     * to by the reference passed
     * */
    scaleUniform( vec4 ){
        // if ( !State.perspectiveEnabled ) {
            vec4.x = State.scaleX * vec4.x;
            vec4.y = State.scaleY * vec4.y;
            vec4.z = State.scaleZ * vec4.z;
        // }
        return vec4;
    }


    /* model space transformations */
    modelTransform(vec4In, vec4Out){
        return this.scaleUniform(
                this.rotateXAccumulate(
                    this.rotateY( vec4In, vec4Out )) );
    }

    clearAutoRotate(){
        if(State.autoRotateAnimationID != -1) {
            clearInterval(State.autoRotateAnimationID);
            State.disableAutoRotation();
        }
    }

    get autoRotationStatus(){
        return this.autoRotation;
    }



}

export {Transformation, ModelTransformations};