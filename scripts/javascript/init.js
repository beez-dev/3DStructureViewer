import {Vec4} from "./utils/mathObjects.js";
import {Trackball, Pan, Panner} from "./camera.js";
import {FZI, ZIndexFilter} from "./zIndexSorting.js";
import {ModelTransformations} from "./transformation.js";
import {Measures} from "./utils/utils.js";

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;


const masterDIV = document.getElementById("masterDIV");
masterDIV.style.width = Measures.px(WIDTH);
masterDIV.style.height = Measures.px(HEIGHT);

const uploadButton = document.querySelector('.uploadButton');
uploadButton.addEventListener('click', function(event){
        document.querySelector('#uploadModelButton-real').click();
        });


const mModeler = new ModelTransformations();

const mTrackballCamera = new Trackball();

const mPanCamera = new Pan(
    new Vec4(0,0,3), new Vec4(0,0,2), new Vec4(0,1,0)
);

/* helper class for retaining state */
class State {
    static redraw = true;/* draw based on fzi initially */
    static autoRotate = false;
    static autoRotationFPSValue = 25;/*fps*/
    static autoRotateAnimationIDValue = -1;
    static maxFPSAllowedValue = 55;/*fps*/


    static get autoRotationAnimationID(){
        return State.autoRotateAnimationIDValue;
    }

    static set autoRotationAnimationID(ID){
        State.autoRotateAnimationIDValue = ID;
    }

    static get autoRotationFPS(){
        return State.autoRotationFPSValue;
    }

    static set autoRotateFPS(fpsValue){
        if( fpsValue > State.maxFPSAllowed ){
            fpsValue = State.maxFPSAllowed;
        }
        State.autoRotationFPSValue = fpsValue;
    }



    static get maxFPSAllowed(){
        return State.maxFPSAllowedValue;
    }


    static getAutoRotationState(){
        return State.autoRotate;
    }

    static enableAutoRotation(){
        State.autoRotate = true;
    }

    static disableAutoRotation(){
        State.autoRotate = false;
        State.autoRotateAnimationIDValue = -1;
    }


    static disableRedraw() {
        State.redraw = false;
    }

    static enableRedraw() {
        State.redraw = true;
    }
}

const zIndexFilter = new ZIndexFilter();

const mPanner = new Panner();

export { HEIGHT, WIDTH, mTrackballCamera,
    mPanCamera,mModeler, mPanner,
    zIndexFilter, State };