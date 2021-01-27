import {Trackball, Pan} from "./camera.js";
import {Vec4} from "./utils/mathObjects.js";

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

const mTrackballCamera = new Trackball(
    new Vec4(0,0,3), new Vec4(0,0,0),new Vec4(0,1,0)
    );

const mPanCamera = new Pan(
    new Vec4(0,0,3), new Vec4(0,0,2), new Vec4(0,1,0)
);


export {HEIGHT, WIDTH, mTrackballCamera, mPanCamera};