import {Vec4} from "./utils/mathObjects.js";
import * as global from "./GLOBALs.js";
import {mCamera} from "./GLOBALs.js";


class Transformation{

    constructor(){
        this.reCalcProjection = true;
        this.x1m=0;
        this.x2m=0;
        this.y1m=0;
        this.y2m=0;
        this.z1m=0;
        this.z2m=0;
        this.w1m=0;
    }

    /*perspective projection matrix transformation
    * */
    perspectiveProjection(vec4, aspectRatio, fovHalf=45, near = .1, far = 500){

        if(this.getProjectionRecalc()) {
        /*recalculate*/
            let top = Math.tan(fovHalf)*near;
            let right = aspectRatio * top;
            let bottom = -top;
            let left = -top * aspectRatio;

            /*x and y multipliers saved for optimization*/
            this.x1m = (2*near)/(right-left);
            this.x2m = (right+left)/(right-left);

            this.y1m = (2*near)/(top-bottom);
            this.y2m = (top+bottom)/(top-bottom);

            this.z1m = (-(far+near))/(far-near);
            this.z2m = (-2*(far*near))/(far-near);

            this.w1m = -1;/*always -1 for NDC division*/
            this.disableProjectionRecalc();

        }

        /*return clip space coordinates*/

        vec4.setX( (this.x1m * vec4.x) + (this.x2m * vec4.z) );
        vec4.setY( (this.y1m * vec4.y) + (this.y2m * vec4.z) );
        vec4.setZ( (this.z1m * vec4.z) + (this.z2m * vec4.w) );
        vec4.setW( this.w1m * vec4.z );

        return vec4;

    }



    ndcTransform(vec4){
        let wValue = vec4.w;
        vec4.setX((vec4.x/wValue));
        vec4.setY((vec4.y/wValue));
        vec4.setZ(vec4.z/wValue);
        vec4.setW(vec4.w/wValue);
        return vec4;
    }

    disableProjectionRecalc(){
        this.reCalcProjection = false;
    }

    enableProjectionRecalc(){
        this.reCalcProjection = true;
    }

    getProjectionRecalc(){
        return this.reCalcProjection;
    }

    screenTransform(vec4){
        vec4.setX((vec4.x * global.WIDTH) + global.WIDTH/2 );/*translate to center of the screen*/
        vec4.setY((vec4.y * global.HEIGHT) + global.HEIGHT/2 );

        return vec4;
    }

    /*
    * takes in a vec4 object and
    * transforms it through the rendering pipeline;
    * vec4 come from the model space
    * */
    pipeline(vec4In, vec4Out){
        return this.screenTransform(
                 this.ndcTransform(
                    this.perspectiveProjection(
                        mCamera.viewTransform(vec4In, vec4Out)
                        ,global.WIDTH/global.HEIGHT
                    )
                )
            );
    }

    /*
    * takes an array of vec4 and transforms them through the pipeline
    * */
    pipelineTransform(vec4ArrIn, vec4ArrOut){
        for( let i=0; i < vec4ArrIn.length; i++ ){
            this.pipeline( vec4ArrIn[i], vec4ArrOut[i] );
        }
    }

}


export {Transformation};