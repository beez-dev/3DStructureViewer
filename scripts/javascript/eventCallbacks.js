import {mModeler, mPanCamera, mPanner, mTrackballCamera} from "./GLOBALs.js";
import {TransformUtils} from "./utils/transformationUtils.js";
import {Vec4} from "./utils/mathObjects.js";

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


    cameraTranslate(camera, x, y) {
        let direction = 1;

        if(this.mouseDown) {

        }

    }

    keyPressHandler(event){
        console.log("key is pressed");
    }

    scrollEventHandler(event){

        if(event.deltaY < 0){
            mTrackballCamera.zoomOut();
        }else{
            mTrackballCamera.zoomIn();
        }


    }

    mouseMoveHandler(event) {
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

            if(this.mouseDownButton === 0){
                /*pan the model*/
                mPanner.moveHorizontal(directionX * Math.abs(this.mouseDownX - eventClientX));
                mPanner.moveVertical(directionY * Math.abs(this.mouseDownY - eventClientY));

            }
            else if(this.mouseDownButton === 1) {
                /*rotate the model*/
                let scrollSpeedX = .01;
                let scrollSpeedY = .0045;
                mModeler.rotY(-directionX * scrollSpeedX *Math.abs(this.mouseDownX - eventClientX) );
                mModeler.rotX( directionY * scrollSpeedY *Math.abs(this.mouseDownY - eventClientY) );
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
        console.log("mouse has entered");
    }

    mouseLeaveHandler(event){
        this.mouseDown= false;
        console.log("mouse has left");
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