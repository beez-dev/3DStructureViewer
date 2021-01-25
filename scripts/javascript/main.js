import {ObjParser} from "./ObjParser.js";
import {MeshUtils} from "./utils/meshUtils.js";
import {Vec2, Vec3} from "./utils/mathObjects.js";
import {Transformation} from "./transformation.js";

function main(){

    let mCtx = document.querySelector('canvas').getContext('2d');
    let width = GLOBAL_WIDTH;
    let height = GLOBAL_HEIGHT;

    let mTransform = new Transformation();

    mCtx.canvas.width = width;
    mCtx.canvas.height = height;

    mCtx.fillStyle = "#eeeeee";
    mCtx.fillRect( 0,0,width,height );

    let input = document.querySelector("input[type=file]");
    let meshUtil = new MeshUtils();
    let parser = null;

    function simplePerspective(vec3) {
        let focalLength = 100;

        let newX = (focalLength*(vec3.x))+100;

        console.log("y values: ", vec3.y);
        let newY = (focalLength * -(vec3.y))+100;


        return new Vec2(newX, newY);
    }

    input.addEventListener('change', function (e) {
        mCtx.clearRect(0,0,width,height);
        parser = new ObjParser(e.target,
            function(){
                let filename = parser.getAvailableFileNames(); /*single file support only*/
                let objectName = parser.getAvailableObjectNames(filename);
                let vertices = parser.getAllVertices(filename, objectName);
                let fvis = parser.getAllFvis(filename, objectName);

                console.log(vertices[0].x, vertices[0].y, vertices[0].z, vertices[0].w);
                mTransform.pipelineTransform(vertices);

                let mNew = new MeshUtils();
                mNew.drawFaceStroke(mCtx,vertices, fvis);
            }
        );
    });











}


window.onload = main;