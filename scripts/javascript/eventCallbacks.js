class EventCallback{

    constructor(){
        this.cameraTranslateOffset = .5;
        this.mouseDownX = 0;
        this.mouseDownY = 0;

        /*denotes if the */
        this.mouseDown = false;

    }


    cameraTranslate(camera, x, y) {
        let direction = 1;

        if(this.mouseDown) {
            if (x < this.mouseDownX) {
                direction = -direction;
                this.mouseDownX = x;
                this.mouseDownY = y;
            }


            camera.P.x += direction * this.cameraTranslateOffset;
        }

    }

    mouseDownHandler(x, y){
        this.mouseDownX = x;
        this.mouseDownY = y;
        this.mouseDown = true;
    }

    mouseUpHandler(x, y){
        this.mouseDown = false;
        this.mouseDownX = x;
        this.mouseDownY = y;
    }

    /*get the x, y coordinate tuple relative to the canvas */
    getWindowToCanvasCoords(canvas, AbsX, AbsY){
        const rect = canvas.getBoundingClientRect();
        const x = AbsX - rect.left;/*coordinates relative to the canvas*/
        const y = AbsY - rect.top;
        return [x, y];
    }

}


export {EventCallback};