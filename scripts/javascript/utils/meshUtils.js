import {Vec4} from "./mathObjects.js";
import {mTrackballCamera} from "../init.js";
import {TransformUtils} from "./transformationUtils.js";

class MeshUtils{
    constructor() {
        /*a temporary vertex variables to avoid variable
        * allocation on every redraw*/
        this.vertexHolder0     =  new Vec4();
        this.vertexHolder1     =  new Vec4();
        this.vertexHolder2     =  new Vec4();
        this.vectorDifference1 =  new Vec4();
        this.vectorDifference2 =  new Vec4();
        this.tempCrossProduct  =  new Vec4();
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
        ctx.moveTo(
            (vertices[fvi[0]].x), (vertices[fvi[0]].y)
        );

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


    drawFaceFillStroke(ctx, vertices, fvis){
        fvis.forEach(
            function(fvi){
                this.drawFace(ctx,vertices, fvi);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }.bind(this)
        );
    }

    /* draw face with fill and stroke with fvi instead of fvis */
    drawFaceFillStrokeIndiv(ctx, vertices, fvi){
        this.drawFace(ctx,vertices, fvi);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    /* backface detection algorithm
    * return value: false- don't draw; true- draw*/
    backfaceCulling(vertices, fvi) {

        // fvi is guaranteed to be of atleast 3 length, so no index is out of bounds
        this.vertexHolder0 = vertices[fvi[0]]; //start vertex- vertex from which drawing of a face starts
        this.vertexHolder1 = vertices[fvi[1]]; //second face vertex
        this.vertexHolder2 = vertices[fvi[2]]; //third face vertex

        /*find direction vectors of vertices*/
        TransformUtils.subtractAccumulate(
            this.vectorDifference1,
            this.vertexHolder1,
            this.vertexHolder0);
        TransformUtils.subtractAccumulate(
            this.vectorDifference2,
            this.vertexHolder2,
            this.vertexHolder0);

        /*take the cross product*/
        TransformUtils.crossProductAccumulate(this.tempCrossProduct,
            this.vectorDifference1,
            this.vectorDifference2);

        if (TransformUtils.dotProduct(this.tempCrossProduct,
            mTrackballCamera.getDirectionVector()) <= 0) {
            return false;
        }
        return true;
    }


    drawWithBackfaceCulling(ctx, outputVertices, fvis){
        fvis.forEach(
            function(fvi){
                this.drawWithBackfaceCullingIndivFvi(ctx,outputVertices, fvi);
            }.bind(this)
        );
    }


    /* backface culling taking individual fvi as input */
    drawWithBackfaceCullingIndivFvi(ctx, outputVertices, fvi){
        if(this.backfaceCulling(outputVertices, fvi )) {
            this.drawFace(ctx, outputVertices, fvi);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            return true;
        }
        return false;
    }

    /* painter's algorithm */
    drawFaceWithZOrder(ctx, outputVertices, faces) {
       faces.sort( (a, b) => a.zIndexViewSpace > b.zIndexViewSpace ? 1: -1 );

       faces.forEach(
            function( face ) {
                this.drawFaceFillStrokeIndiv(ctx, outputVertices, face.fvi);
            }.bind( this )
       );

    }
}

class Face{
    constructor(fvi=[]){
        this.faceFVI = fvi;
        this.viewSpaceVertices = [];
    }

    get zIndexViewSpace() {
        /*depth index approximation of a face*/
        let zCoordMax = this.viewSpaceVertices[0].z;
        for(let i = 1; i < this.viewSpaceVertices.length;i++){
            if(this.viewSpaceVertices[i].z > zCoordMax){
                zCoordMax = this.viewSpaceVertices[i].z;
            }
        }
        return zCoordMax;
    }

    get fvi(){
        return this.faceFVI;
    }

    set fvi(fvi){
        this.faceFVI = fvi;
    }


}

export { MeshUtils, Face };