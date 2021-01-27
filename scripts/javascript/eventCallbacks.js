import {mPanCamera, mTrackballCamera} from "./GLOBALs.js";
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
        this.mouseDownY = event.clientY;
        this.mouseDownX = event.clientX


        if (this.mouseDown) {


            if(this.mouseDownButton === 0){
                /*pan the model*/
                console.log( "Button zero was pressed, ",this.mouseDownButton);
                mPanCamera.setP(
                    Transform.add(mPanCamera.P, Transform.scale(directionY * speed, mPanCamera.U)) );
                mPanCamera.setP(
                    Transform.add(mPanCamera.P, Transform.scale(directionX * speed, mPanCamera.R)) );

                mPanCamera.buildLookAtVectors(
                    mPanCamera.P,
                    Transform.add( mPanCamera.P, new Vec4(0,0,-1) ),
                    new Vec4(0,1,0)
                );

            }else if(this.mouseDownButton === 1) {
                /*rotate the model*/

                console.log( "Button one was pressed, ", this.mouseDownButton );
                mTrackballCamera.setP(
                    Transform.add(mTrackballCamera.P, Transform.scale(directionY * speed, mTrackballCamera.U)) );
                mTrackballCamera.setP(
                    Transform.add(mTrackballCamera.P, Transform.scale(directionX * speed, mTrackballCamera.R)) );


                mTrackballCamera.buildLookAtVectors(
                    mTrackballCamera.P,
                    new Vec4(0,0,0),
                    new Vec4(0,1,0)
                );
            }
        }
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