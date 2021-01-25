import {ObjParser} from "./ObjParser.js";
import {MeshUtils} from "./meshUtils.js";
import {Vec2, Vec3} from "./mathObjects.js";
import {utils} from "./test.js"

function main(){


    let mCtx = document.querySelector('canvas').getContext('2d');
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;

    mCtx.canvas.width = width;
    mCtx.canvas.height = height;

    mCtx.fillStyle = "#eeeeee";
    mCtx.fillRect( 0,0,width,height );

    let input = document.querySelector("input[type=file]");
    let meshUtil = new MeshUtils();
    let parser = null;

    function simplePerspective(vec3) {
        let focalLength = 100;

        let newX = (focalLength*(vec3.x)/(vec3.z+2))+100;

        console.log("y values: ", vec3.y);
        let newY = (focalLength * -(vec3.y)/(vec3.z+2))+100;


        return new Vec2(newX, newY);
    }

    input.addEventListener('change', function (e) {
        mCtx.clearRect(0,0,width,height);
        parser = new ObjParser(e.target,
            function(){
                let filename = parser.getAvailableFileNames(); /*single file support only*/
                /*filename.forEach(
                    function(filenamed){
                        console.log("file name: ", filenamed);
                        let allObjects = parser.getAvailableObjectNames(filenamed);
                        allObjects.forEach(function(eachObject){
                            console.log(eachObject);
                            console.log(parser.getAllVertices(filenamed,eachObject, ObjParser.OBJ_VERT_CMD));
                        });

                    }
                );*/
                let objectName = parser.getAvailableObjectNames(filename);
                let vertices = parser.getAllVertices(filename, objectName);
                let fvis = parser.getAllFvis(filename, objectName);

                let projectedPoints = [];

                let mCube = [
                    new Vec3()
                ]

                vertices.forEach(
                    function(vertex){
                        projectedPoints.push( simplePerspective(vertex) );
                    });

                meshUtil.drawFaceStroke(mCtx,projectedPoints, fvis);
            }
        );
    });











}


window.onload = main;