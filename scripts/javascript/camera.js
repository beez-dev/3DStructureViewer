import {TransformUtils} from "./utils/transformationUtils.js";
import {Vec4} from "./utils/mathObjects.js";

class Camera{
    constructor(vec4_position, vec4_target, vec4_upVector) {
        /* P is the position of the camera in world space */
        this.P = vec4_position;
        this.target = vec4_target;

        /*D is the direction axis: vector pointing towards the camera*/
        this.D = TransformUtils.subtract(this.P, this.target);
        TransformUtils.hNormalizeVec4(this.D);

        this.upVector = vec4_upVector;

        /*R is the right axis of the camera coordinate system*/
        this.R = TransformUtils.crossProduct(this.upVector, this.D);
        TransformUtils.hNormalizeVec4(this.R);
        /*
        * U is the upAxis of the camera coordinate system
        * note, this is not the UpVector used to find the Up Axis via grahm-schmidt process
        * */
        this.U = TransformUtils.crossProduct(this.D, this.R);
        TransformUtils.hNormalizeVec4(this.U);
    }

    getUpAxis(){
        return this.U;
    }

    getRightAxis(){
        return this.R;
    }

    getDirectionAxis(){
        return this.D;
    }

    translateUp(factor){
        TransformUtils.addAccumulate(this.P, factor*this.U);
    }

    translateRight(factor){

    }
}


class CameraFlyStyle extends Camera{
    constructor(vec4_position, vec4_target, vec4_upVector) {
        super(vec4_position, vec4_target, vec4_upVector);
    }

    /*
    * lookAt transform via inverse matrices
    * */
    viewTransform(vec4In , vec4Out) {

        vec4Out.x = ((vec4In.x * this.R.x) + (vec4In.y * this.R.y) + (vec4In.z * this.R.z))
                    - ((this.R.x * this.P.x) + (this.R.y * this.P.y) + (this.R.z * this.P.z));

        vec4Out.y = ((vec4In.x * this.U.x) + (vec4In.y * this.U.y) + (vec4In.z * this.U.z))
                    - ((this.U.x * this.P.x) + (this.U.y * this.P.y) + (this.U.z * this.P.z));

        vec4Out.z = ((vec4In.x * this.D.x) + (vec4In.y * this.D.y) + (vec4In.z * this.D.z))
                    - ((this.D.x * this.P.x) + (this.D.y * this.P.y) + (this.D.z * this.P.z));

        this.D = TransformUtils.subtract(this.P, this.target);
        TransformUtils.hNormalizeVec4(this.D);
        this.R = TransformUtils.crossProduct(this.upVector, this.D);
        TransformUtils.hNormalizeVec4(this.R);
        this.U = TransformUtils.crossProduct(this.D, this.R);
        TransformUtils.hNormalizeVec4(this.U);

        return vec4Out;
    }

}

export {CameraFlyStyle};