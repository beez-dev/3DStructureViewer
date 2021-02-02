import {Vec4} from "./utils/mathObjects.js";
import {TransformUtils} from "./utils/transformationUtils.js";
import {
    modeler, panCamera, panner,
    mainCamera, State, State as Scale
} from "./init.js";

class EventCallback{

    constructor(){
        this.cameraTranslateOffset = .5;
        this.mouseDownX = 0;
        this.mouseDownY = 0;

        /*denotes if the */
        this.mouseDown = false;
        this.mouseDownButton = 0; /*LMB by default*/

        /*keeps track of the mouse down event target*/
        this.lastDownTarget = null;

    }


    keyPressHandler(event){
        console.log("key is pressed");
    }

    scrollEventHandler(event){

        if (State.perspectiveEnabled) {
            if (event.deltaY < 0) {
                mainCamera.zoomOut();
            } else {
                mainCamera.zoomIn();
            }

        } else {

            if (event.deltaY < 0) {
                Scale.incrementScale();
            } else {
                Scale.decrementScale();
            }
        }

    }

    mouseMoveHandler(event, onDragCallback=null) {
        // console.log("mouse is moving...");
        let speed = .15;
        let directionX = 1;
        let directionY = 1;
        let eventClientX = event.clientX;
        let eventClientY = event.clientY;

        if(eventClientX < this.mouseDownX){
            directionX = -directionX;
        }

        if(eventClientY < this.mouseDownY){
            directionY = -directionY;
        }


        if (this.mouseDown) {
            if(onDragCallback != null){
                onDragCallback();
            }
            if(this.mouseDownButton === 0){
                /*pan the model*/
                panner.moveHorizontal(directionX * Math.abs(this.mouseDownX - eventClientX) );
                panner.moveVertical  (directionY * Math.abs(this.mouseDownY - eventClientY) );

            }
            else if(this.mouseDownButton === 1) {
                /*rotate the model*/
                let scrollSpeedX = .01;
                let scrollSpeedY = .0045;
                modeler.rotY(-directionX * scrollSpeedX *Math.abs(this.mouseDownX - eventClientX) );
                modeler.rotX( directionY * scrollSpeedY *Math.abs(this.mouseDownY - eventClientY) );
            }
        }

        this.mouseDownY = event.clientY;
        this.mouseDownX = event.clientX

    }

    mouseDownHandler(event){
        this.mouseDownX = event.clientX;
        this.mouseDownY = event.clientY;
        this.mouseDown = true;
        this.lastDownTarget = event.target;
        this.mouseDownButton = event.button;


    }

    mouseUpHandler(event){
        this.mouseDown = false;
        this.mouseDownX = event.clientX;
        this.mouseDownY = event.clientY;
    }

    mouseEnteredHandler(event){
        // console.log("mouse has entered");
    }

    mouseLeaveHandler(event){
        this.mouseDown= false;
        // console.log("mouse has left");
    }


    autoRotationHandler(event){
        if( State.autoRotationState ){
            State.disableAutoRotation();
        }else {
            State.enableAutoRotation(
                ()=>{
                    modeler.rotY(State.autoRotationFactor) });
        }
    }

    projectionSwitchHandler(event) {
        if(State.perspectiveEnabled){
            console.log("orthographic enabled");
            State.enableOrthographic(true);
        }else{
            console.log("perspective enabled");
            State.enablePerspective(true);
        }
    }

    shadingSelectionHandler(event){
        console.log("shading selection working")
        State.cycleShadingFromCurrent();
        State.forceRedraw();
    }

    /*get the x, y coordinate tuple relative to the canvas */
    getWindowToCanvasCoords(canvas, AbsX, AbsY){
        const rect = canvas.getBoundingClientRect();
        const x = AbsX - rect.left;/*coordinates relative to the canvas*/
        const y = AbsY - rect.top;
        return [x, y];
    }

    getLastTarget(){
        return this.lastDownTarget;
    }


}


export {EventCallback};