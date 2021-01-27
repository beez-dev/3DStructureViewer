import {Trackball, Pan, Panner} from "./camera.js";
import {Vec4} from "./utils/mathObjects.js";
import {ModelTransformations} from "./transformation.js";

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

const mModeler = new ModelTransformations();

const mTrackballCamera = new Trackball(
    new Vec4(0,0,3), new Vec4( 0,0,0 ),new Vec4(0,1,0)
    );

const mPanCamera = new Pan(
    new Vec4(0,0,3), new Vec4(0,0,2), new Vec4(0,1,0)
);


const mScreenSpacePan = new Panner();

export {HEIGHT, WIDTH, mTrackballCamera,
    mPanCamera,mModeler, mScreenSpacePan};