import {mPanCamera, mTestPan, mTrackballCamera} from "./GLOBALs.js";
import {Transform} from "./utils/transformationUtils.js";
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
    }

    mouseMoveHandler(event) {
        // console.log("mouse is moving...");
        let speed = .07;
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

            let cameraSpeed = 0.04;
            if(this.mouseDownButton === 0){
                /*pan the model*/
                mTestPan.moveHorizontal(directionX * Math.abs(this.mouseDownX - eventClientX));
                mTestPan.moveVertical(directionY * Math.abs(this.mouseDownY - eventClientY));

            }
            else if(this.mouseDownButton === 1) {
                /*rotate the model*/

                console.log( "MMB clicked" );
                console.log("MMB: position was: ", mTrackballCamera.P);
                console.log("MMB: right vector was: ", mTrackballCamera.R);
                console.log("MMB: direction was was: ", mTrackballCamera.D);
                console.log("MMB: up vector was: ", mTrackballCamera.upVector);
                console.log("MMB: up axis vector was: ", mTrackballCamera.U);

                mTrackballCamera.setP(
                    Transform.add( mTrackballCamera.P, mTrackballCamera.R  ) );



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