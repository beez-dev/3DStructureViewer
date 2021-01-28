import {Trackball, Pan, Panner} from "./camera.js";
import {Vec4} from "./utils/mathObjects.js";
import {ModelTransformations} from "./transformation.js";

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

const mModeler = new ModelTransformations();

const mTrackballCamera = new Trackball();

const mPanCamera = new Pan(
    new Vec4(0,0,3), new Vec4(0,0,2), new Vec4(0,1,0)
);


const mPanner = new Panner();

export {HEIGHT, WIDTH, mTrackballCamera,
    mPanCamera,mModeler, mPanner};