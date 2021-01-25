import {TransformUtils} from "./utils/transformationUtils.js";

class Camera{
    constructor(vec4_position, vec4_target, vec4_upVector) {
        /* P is the position of the camera in world space */
        this.P = vec4_position;
        this.target = vec4_target;
        /*D is the direction axis: vector pointing towards the camera*/
        this.D = TransformUtils.subtract(this.P, this.target)
        this.upVector = vec4_upVector;
        /*R is the right axis of the camera coordinate system*/
        this.R = TransformUtils.crossProduct(this.upVector, this.D);
        /*
        * U is the upAxis of the camera coordinate system
        * note, this is not the UpVector used to find the Up Axis via grahm-schmidt process
        * */
        this.U = TransformUtils.crossProduct(this.D, this.R);
    }

    getUpAxis(){
        return this.upAxis;
    }

    getRightAxis(){
        return this.rightAxis;
    }

    getDirectionAxis(){
        return this.D;
    }
}


class CameraFlyStyle extends Camera{
    constructor(vec4_position, vec4_target, vec4_upVector) {
        super(vec4_position, vec4_target, vec4_upVector);
    }

    /*
    * lookAt transform via inverse matrices
    * */
    viewTransform(vec4){
        vec4.setX( ((vec4.x * this.R.x)   + (vec4.y   * this.R.y) + (vec4.z * this.R.z))
                  -((this.R.x * this.P.x) + (this.R.y * this.P.y) + (this.R.z * this.P.z)) );

        vec4.setY( ((vec4.x * this.U.x)   + (vec4.y   * this.U.y) + (vec4.z * this.U.z))
                  -((this.U.x * this.P.x) + (this.U.y * this.P.y) + (this.U.z * this.P.z)) );

        vec4.setZ( ((vec4.x * this.D.x)   + (vec4.y   * this.D.y) + (vec4.z * this.D.z))
                  -((this.D.x * this.P.x) + (this.D.y * this.P.y) + (this.D.z * this.P.z)) );

        return vec4;
    }
}

export {CameraFlyStyle};