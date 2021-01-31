import {Vec4} from "./utils/mathObjects.js";
import {TransformUtils} from "./utils/transformationUtils.js";

class Camera{
    constructor(vec4_position = new Vec4(0,0,3),
                vec4_target = new Vec4( 0,0,0 ),
                vec4_upVector = new Vec4(0,1,0)) {
        /* P is the position of the camera in world space */

        this.P        = vec4_position;
        this.target   = vec4_target;
        this.upVector = vec4_upVector;
        /*D is the direction axis: vector pointing towards the camera*/
        this.D        = 0;
        /*R is the right axis of the camera coordinate system*/
        this.R        = 0;
        /*
        *  U is the upAxis of the camera coordinate system
        *  note, this is not the UpVector used to find the Up Axis via grahm-schmidt process
        * */
        this.U        = 0;
        this.zoomTranslationFactor = .03;
        this.buildLookAtVectors(vec4_position, vec4_target, vec4_upVector);
    }

    buildLookAtVectors(vec4_position, vec4_target, vec4_upVector){
        this.P = vec4_position;
        this.target = vec4_target;

        this.D = TransformUtils.subtract(this.P, this.target);
        TransformUtils.hNormalizeVec4(this.D);

        this.upVector = vec4_upVector;

        this.R = TransformUtils.crossProduct(this.upVector, this.D);
        TransformUtils.hNormalizeVec4(this.R);

        this.U = TransformUtils.crossProduct(this.D, this.R);
        TransformUtils.hNormalizeVec4(this.U);
    }

    /*set the camera position vector*/
    setP(vec4){
        this.P.x = vec4.x;
        this.P.y = vec4.y;
        this.P.z = vec4.z;
    }


    /*
    * lookAt matrix transformation for the
    * default FPS style navigation */
    viewTransform(vec4In , vec4Out) {

        vec4Out.x = ((vec4In.x * this.R.x) + (vec4In.y * this.R.y) + (vec4In.z * this.R.z))
                    - ((this.R.x * this.P.x) + (this.R.y * this.P.y) + (this.R.z * this.P.z));

        vec4Out.y = ((vec4In.x * this.U.x) + (vec4In.y * this.U.y) + (vec4In.z * this.U.z))
                    - ((this.U.x * this.P.x) + (this.U.y * this.P.y) + (this.U.z * this.P.z));

        vec4Out.z = ((vec4In.x * this.D.x) + (vec4In.y * this.D.y) + (vec4In.z * this.D.z))
                    - ((this.D.x * this.P.x) + (this.D.y * this.P.y) + (this.D.z * this.P.z));

        return vec4Out;
    }

    /*get the up axis vector, different from the up vector*/
    getUpAxisVector(){
        return this.U;
    }

    getRightVector(){
        return this.R;
    }

    getDirectionVector(){
        return this.D;
    }

    zoomOut(){
        this.P.z -= this.zoomTranslationFactor;
    }

    zoomIn(){
        this.P.z += this.zoomTranslationFactor;
    }

}


class Trackball extends Camera{
    constructor(vec4_position, vec4_target, vec4_upVector) {
        super(vec4_position, vec4_target, vec4_upVector);
    }
}


class Pan extends Camera{
    constructor(vec4_position, vec4_target, vec4_upVector) {
        super(vec4_position, vec4_target, vec4_upVector);
    }

}

class Panner {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }


    pan(vec4){
        vec4.x -= this.x * .005;
        vec4.y -= this.y * .005;
        vec4.z -= this.z * .005;
        return vec4;
    }

    moveHorizontal(factor){
        this.x += factor;
    }

    moveVertical(factor){
        this.y += factor;
    }


}

export {Trackball, Pan, Panner};