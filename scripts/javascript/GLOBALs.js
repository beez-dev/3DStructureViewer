import {CameraFlyStyle} from "./camera.js";
import {Vec4} from "./utils/mathObjects.js";

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

const mCamera = new CameraFlyStyle(
    new Vec4(0,0,3), new Vec4(0,0,0),new Vec4(0,1,0)
    );



setInterval(
    function(){
        mCamera.R.x += 0.5
    }, 500
)


export {HEIGHT, WIDTH, mCamera};