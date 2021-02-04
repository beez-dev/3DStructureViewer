import {Vec4} from "./utils/mathObjects.js";
import {Trackball, Pan, Panner} from "./camera.js";
import {FZI, ZIndexFilter} from "./zIndexSorting.js";
import {ModelTransformations, Scaler} from "./transformation.js";
import {Convert, Measures} from "./utils/utils.js";
import {EventCallback} from "./eventCallbacks.js";

var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight;

const callbacks = new EventCallback();


const masterDIV = document.getElementById("masterDIV");
masterDIV.style.width = Measures.px(WIDTH);
masterDIV.style.height = Measures.px(HEIGHT);

/* click delegation callbacks are assigned here */
const uploadButton = document.querySelector('.uploadButton');
uploadButton.addEventListener('click', function(event){
            document.querySelector('#uploadModelButton-real').click();
        });

const startScreenBrowseBtn = document.querySelector('#startScreenBrowseBtn');
startScreenBrowseBtn.addEventListener('click', function(event){
            callbacks.handleStartScreenBrowse(event);
        });

const modelSurfaceColorChooser = document.querySelector('#modelSurfaceColor');
modelSurfaceColorChooser.addEventListener('click',function(){
            document.querySelector('#modelSurfaceColor-real').click();
        });

const modelWireColorChooser = document.querySelector("#modelWireColor");
modelWireColorChooser.addEventListener('click', function(){
            document.querySelector('#modelWireColor-real').click();
        });


const canvasBgColorChooser = document.querySelector('#canvasBackgroundColor');
canvasBgColorChooser.addEventListener('click', function(){
            document.querySelector('#canvasBackgroundColor-real').click();
        });



const modeler = new ModelTransformations();

const mainCamera = new Trackball();

const panCamera = new Pan(
    new Vec4(0,0,3), new Vec4(0,0,2), new Vec4(0,1,0)
);

const screenSpaceScaler = new Scaler();

/* helper class for retaining state and globally used Constants */
class State {
    static redraw = true;/* draw based on fzi initially */
    static autoRotateState = false;
    static autoRotationFPSValue = 25;/*fps*/
    static autoRotateAnimationIDValue = -1;
    static maxFPSAllowedValue = 55;/*fps*/
    static autoRotationFactorValue = 0.01;
    static forceRedraw = ()=>{};/*do nothing by default*/
    static perspectiveProjection = true;
    static orthographicProjection = false;
    static defaultScale = 1;
    static maxScale = 3;
    static minScale = 0.1;
    static currentScaleValue = State.defaultScale;
    static scaleFactorValue = 0.05;
    static scaleXValue = State.defaultScale;
    static scaleYValue = State.defaultScale;
    static scaleZValue = State.defaultScale;

    /*
    * indicates whether the browse button was pressed in the start screen*/
    static startScreenBrowsed = false;

    /*recalculation optimization variables for projection transformations*/
    static reCalcPerspectiveProjection  =  true;
    static reCalcOrthographicProjection =  false;


    static shadingTypesAvailable = [
                                    State.SHADE_WIRE,
                                    State.SHADE_FLAT,
                                    State.SHADE_FLAT_WIRE ];

    static currentDrawTypeValue = State.SHADE_FLAT_WIRE;
    static currentShadingIndexValue = 2;                /*State.SHADE_FLAT_WIRE is the default shading*/

    static canvasBackgroundColor = "#eaeaea";
    // static canvasBackgroundColor = "#2f2f2f";
    static modelSurfaceColor = "#3c3c3c";
    static modelWireColor = "#9b9b9b";

    static get shadings(){
        return State.shadingTypesAvailable;
    }

    static get currentShadingType(){
        return State.currentDrawTypeValue;
    }

    static set currentShadingType(drawTypeCode ){
        State.currentDrawTypeValue = drawTypeCode;
    }

    /* linearly traverse the shading types */
    static incrementShadingIndex(){
        State.currentShadingIndexValue =
                            (State.currentShadingIndexValue + 1)
                            % ((State.shadings).length);
        return State.currentShadingIndexValue;
    }

    /*traverse all shading types beginning
        from the current shading type as the
        start point in the list of available types of shading*/
    static cycleShadingFromCurrent(){
         State.currentShadingType = State.shadings[ State.incrementShadingIndex() ];
    }


    static get SHADE_FLAT(){
        return 3446;
    }

    static get SHADE_WIRE(){
        return 3445;
    }


    static get SHADE_FLAT_WIRE(){
        return 3447;
    }

    static get perspectiveEnabled(){
        return State.perspectiveProjection;
    }

    static get orthographicEnabled(){
        return State.orthographicProjection;
    }

    /* enable perspective projection */
    static enablePerspective(forceRedraw = false){
        State.orthographicProjection = false;
        State.perspectiveProjection = true;
        State.enablePerspProjectionRecalc( );
        if(forceRedraw){
            State.forceRedraw(  );
        }
    }

    /* enable orthographic projection */
    static enableOrthographic(forceRedraw = false){
        State.orthographicProjection = true;
        State.perspectiveProjection = false;
        State.enableOrthoProjectionRecalc( );
        if(forceRedraw){
            State.forceRedraw();
        }

    }

    static disablePerspProjectionRecalc() {
        State.reCalcPerspectiveProjection  =  false;
        State.reCalcOrthographicProjection =  true;
    }

    static disableOrthoProjectionRecalc() {
        State.reCalcPerspectiveProjection  = true;
        State.reCalcOrthographicProjection = false;
    }

    static enablePerspProjectionRecalc() {
        State.reCalcPerspectiveProjection  =  true;
        State.reCalcOrthographicProjection =  false;
    }

    static enableOrthoProjectionRecalc() {
        State.reCalcPerspectiveProjection  =  false;
        State.reCalcOrthographicProjection =  true;
    }

    static getPerspProjectionRecalc() {
        return State.reCalcPerspectiveProjection;
    }

    static getOrthoProjectionRecalc(){
        return this.reCalcOrthographicProjection;
    }




    static scaleUniform(fac = Static.defaultScale){
        if(fac > State.maxScale){
            fac = State.maxScale;
        }else if(fac < State.minScale){
            fac = State.minScale;
        }

        State.scaleX *= fac;
        State.scaleY *= fac;
        State.scaleZ *= fac;
    }

    static get scaleFactor(){
        return State.scaleFactorValue;
    }

    static get currentScale(){
        return State.currentScaleValue;
    }

    static set currentScale(value){
        State.currentScaleValue = value;
    }

    /* gradually scaleScreenSpace the object */
    static incrementScale() {
        State.currentScale = 1; /*reset scaleScreenSpace start point*/
        State.currentScale += State.scaleFactorValue;
        State.scaleUniform( State.currentScale );
        return State.currentScale;
    }

    static scaleFac(fac){
        State.currentScale = 1;
        State.currentScale += fac;
        State.scaleUniform(State.currentScale);
        return State.currentScale;
    }

    /* gradually scaleScreenSpace down the object */
    static decrementScale() {
        State.currentScale = 1; /*reset scaleScreenSpace start point*/
        State.currentScale -= State.scaleFactorValue;
        State.scaleUniform( State.currentScale );
        return State.currentScale;
    }

    static set scaleX(value){
        State.scaleXValue = value;
    }

    static set scaleY(value){
        State.scaleYValue = value;
    }

    static set scaleZ(value){
        State.scaleZValue = value;
    }

    static get scaleX(){
        return State.scaleXValue;
    }

    static get scaleY(){
        return State.scaleYValue;
    }

    static get scaleZ(){
        return State.scaleZValue;
    }

    static get autoRotationFactor(){
        return this.autoRotationFactorValue;
    }

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

    static get autoRotationState(){
        return State.autoRotateState;
    }

    static enableAutoRotation( rotationCallback = ()=>{} ){
        if( !State.autoRotationState ){ /*if autoRotation is not enabled*/
            State.autoRotateState = true;
            State.autoRotationAnimationID = setInterval(
                function () {
                        rotationCallback();
                        State.forceRedraw();
                }.bind(this), Convert.fpsIntervals(State.autoRotationFPS) );
        }
    }

    static disableAutoRotation() {
        if(State.autoRotationAnimationID !== -1) {
            clearInterval( State.autoRotationAnimationID );
        }
        State.autoRotationAnimationID  = -1;
        State.autoRotateState = false;
    }

    static disableRedraw() {
        State.redraw = false;
    }

    static enableRedraw() {
        State.redraw = true;
    }


    static get TRANSLATE_X(){
        return "_tx_";
    }

    static get TRANSLATE_Y(){
        return "_ty_";
    }

    static get TRANSLATE_Z(){
        return "_tz_";
    }

    static get ROT_X(){
        return "_rx_";
    }

    static get ROT_Y(){
        return "_ry_";
    }

    /*static get SCALE_X(){
        return "_sx_";
    }

    static get SCALE_Y(){
        return "_sy_";
    }

    static get SCALE_Z(){
        return "_sz_";
    }

    static get SLIDER_TRANSLATE_FACTOR(){
        return 20;
    }*/

}


const zIndexFilter = new ZIndexFilter();

const panner = new Panner();

export { HEIGHT, WIDTH, mainCamera,
    panCamera,modeler, panner,
    zIndexFilter, State, screenSpaceScaler,
    modelSurfaceColorChooser, modelWireColorChooser,
    canvasBgColorChooser, callbacks};