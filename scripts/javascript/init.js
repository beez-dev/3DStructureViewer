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

/*FZI requirement indicator class*/
class FZIindicator{
    static redraw = true;/*draw based on fzi initially*/

    static disableRedraw(){
        FZIindicator.redraw = false;
    }

    static enableRedraw(){
        FZIindicator.redraw = true;
    }
}

const zIndexFilter = new ZIndexFilter();

const mPanner = new Panner();

export { HEIGHT, WIDTH, mTrackballCamera,
    mPanCamera,mModeler, mPanner,
    zIndexFilter, FZIindicator };