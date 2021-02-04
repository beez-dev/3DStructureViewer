import {Vec4} from "./utils/mathObjects.js";
import {TransformUtils} from "./utils/transformationUtils.js";
import {
    modeler, panCamera, panner,
    mainCamera, State, State as Scale, screenSpaceScaler
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


        this.translateLastXValue = 0;
        this.translateLastYValue = 0;
        this.translateLastZValue = 0;

        this.lastScale = 0;

        this.lastRotX = 0;
        this.lastRotY = 0;
    }



    keyPressHandler(event){
        console.log("key is pressed");
    }

    sliderScaleHandler( target , multiplier){

        let scaleFactor = .05;
        let direction = this.getSliderDirection(this.lastScale, target.value)

        State.scaleFac(direction* scaleFactor * multiplier.value);

        this.lastScale = target.value;

        State.forceRedraw();
    }

    sliderTranslateHandler(translationDir, target, multiplier){
        if(translationDir === State.TRANSLATE_X){
            let direction = this.getSliderDirection(this.translateLastX, target.value);
            panner.moveHorizontal(direction * Math.abs(this.translateLastX - target.value) * multiplier.value);
            this.translateLastX = target.value;
            State.forceRedraw();

        }else if(translationDir === State.TRANSLATE_Y){
            let direction = this.getSliderDirection(this.translateLastY, target.value);
            panner.moveVertical(direction * Math.abs(this.translateLastY - target.value) * multiplier.value);
            this.translateLastY = target.value;
            State.forceRedraw();
        }else if(translationDir === State.TRANSLATE_Z){
            let direction = this.getSliderDirection(this.translateLastZ, target.value);
            let zTransformControl = 100; /*control translation harshness for z value*/
            if(direction > 0) {
                mainCamera.zoomInFac ( Math.abs(this.translateLastZ - target.value) * (multiplier.value/zTransformControl) );
            }else if (direction < 0) {
                mainCamera.zoomOutFac( Math.abs(this.translateLastZ - target.value) * (multiplier.value/zTransformControl) );
            }
            this.translateLastZ = target.value;
            State.forceRedraw();
        }
    }

    sliderRotationHandler(rotationDir, target, multiplier){
        let rotationControlFactor = 10;
        if(rotationDir === State.ROT_X) {
            let direction = this.getSliderDirection(this.lastRotX, target.value);
            modeler.rotX( direction * (Math.abs(this.lastRotX - target.value)/rotationControlFactor) * multiplier.value );
            this.lastRotX = target.value;
        }else{
            console.log("y rotation triggered");
            let direction = this.getSliderDirection(this.lastRotY, target.value);
            modeler.rotY( direction * (Math.abs(this.lastRotY - target.value)/rotationControlFactor) * multiplier.value );
            this.lastRotY = target.value;
        }

        State.forceRedraw();

    }


    set scaleLastX(value){
        this.scaleLastXValue = value;
    }

    set scaleLastY(value){
        this.scaleLastYValue = value;
    }

    set scaleLastZ(value){
        this.scaleLastZValue = value;
    }

    get scaleLastX(){
        return this.scaleLastXValue;
    }

    get scaleLastY(){
        return this.scaleLastYValue;
    }

    get scaleLastZ(){
        return this.scaleLastZValue;
    }



    set translateLastX(value){
        this.translateLastXValue = value;
    }

    set translateLastY(value){
        this.translateLastYValue = value;
    }

    set translateLastZ(value){
        this.translateLastZValue = value;
    }

    get translateLastX(){
        return this.translateLastXValue;
    }

    get translateLastY(){
        return this.translateLastYValue;
    }

    get translateLastZ(){
        return this.translateLastZValue;
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

    getSliderDirection(lastValue, currentValue){
        if(lastValue < currentValue){
            /*item has moved forward*/
            return 1;
        }else{
            return -1;
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
        State.cycleShadingFromCurrent();
        State.forceRedraw();
    }

    burgerMenuHandler(event){
            document.getElementById('settingPanelMain')
                .style.transform = "translate(0px)";
    }

    closeSettingPanelHandler(event){
        document.getElementById('settingPanelMain')
            .style.transform = "translate(-300px)";
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