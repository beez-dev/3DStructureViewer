class MeshUtils{
    constructor() {
    }

    /*
    * vertices = array of Vec2 objects;
    * fvi = array of face vertex indices
    * ctx = a canvas context
    *
    * assumes clockwise winding order
    * */
    drawFace(ctx, vertices, fvi){

        ctx.beginPath();
        ctx.moveTo((vertices[fvi[0]].x), (vertices[fvi[0]].y));

        for(let i=1; i < fvi.length; i++){
            ctx.lineTo( (vertices[fvi[i]].x), (vertices[fvi[i]].y)  );
        }
    }

    drawFaceStroke(ctx, vertices, fvis){

        fvis.forEach(
            function(fvi){
                this.drawFace(ctx, vertices, fvi);
                ctx.closePath();
                ctx.stroke();
            }.bind(this)
        )

    }

    drawFaceFill(ctx, vertices, fvis){

        fvis.forEach(
            function(fvi){
                this.drawFace(ctx, vertices, fvi);
                ctx.fill();
            }.bind(this)
        )
    }


}

export {MeshUtils};