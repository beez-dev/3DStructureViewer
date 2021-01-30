import * as global from "./GLOBALs.js";
import {FZI} from "./zIndexSorting.js";
import {ObjParser} from "./ObjParser.js";
import {EventCallback} from "./eventCallbacks.js";
import {Transformation} from "./transformation.js";
import {Face, MeshUtils} from "./utils/meshUtils.js";
import {Vec2, Vec3, Vec4} from "./utils/mathObjects.js";
import {FZIindicator, mTrackballCamera} from "./GLOBALs.js";
import {TransformUtils} from "./utils/transformationUtils.js";



function main(){

    let canvas = document.querySelector('canvas');
    let mCtx = document.querySelector('canvas').getContext('2d');
    let width = global.WIDTH;
    let height = global.HEIGHT;

    let mTransform = new Transformation();

    mCtx.canvas.width = width;
    mCtx.canvas.height = height;

    mCtx.fillStyle = "#eeeeee";
    mCtx.fillRect( 0,0,width,height );

    let input = document.querySelector("input[type=file]");
    let meshUtil = new MeshUtils();
    let callbacks = new EventCallback();
    let parser = null;


    input.addEventListener('change', function (e) {
        mCtx.clearRect(0,0,width,height);
        parser = new ObjParser( e.target,
            function wholeDraw() {
                let filename = parser.getAvailableFileNames(); /*single file support only*/
                let objectName = parser.getAvailableObjectNames(filename);
                /*model space vertices of the object
                * they must not be changed, only transformed by transformation matrices
                * */
                let inputVertices = parser.getAllVertices(filename, objectName);
                let outputVertices = new Array(inputVertices.length);
                let viewCoordCaptures = new Array(inputVertices.length);
                for (let i = 0; i < inputVertices.length; i++) {
                    outputVertices[i] = new Vec4();
                    viewCoordCaptures[i] = new Vec4();
                }

                // /!*each fvi subarray is of length atleast 3 - guaranteed*!/
                let fvis = parser.getAllFvis(filename, objectName);
                let faces = new Array(fvis.length);

                console.log( "fvis: ", fvis );
                console.log( "faces: ", faces );
                console.log( "viewCoordCaptures: ", viewCoordCaptures );


                for( let i=0; i < fvis.length; i++ ){
                    faces[ i ] = new Face(fvis[i]);
                    let eachFvi = fvis[ i ];
                    for(let j = 0; j < eachFvi.length; j++) {
                         /*stick the references of view space vertices
                         to in their face objects*/
                         faces[i].viewSpaceVertices.push( viewCoordCaptures[ eachFvi[j] ] );
                    }
                }

                /*for(let i=0; i < faces.length; i++){
                    let eachFace = faces[i];
                    for(let j = 0; j < eachFace.viewSpaceVertices.length; j++){
                        let eachVertex = eachFace.viewSpaceVertices[j];
                        let eachViewSpaceVertex = viewCoordCaptures[ eachFace.fvi[j] ];
                        console.log(eachVertex == eachViewSpaceVertex);
                    }
                }*/

                canvas.addEventListener("mousedown", function (event) {
                    callbacks.mouseDownHandler(event);
                });

                canvas.addEventListener("mouseup", function (event) {
                    callbacks.mouseUpHandler(event);
                });

                canvas.addEventListener("mousemove",
                    function (event) {
                        callbacks.mouseMoveHandler(event);
                    }.bind(this));

                canvas.addEventListener("mouseenter",
                    function (event) {
                        callbacks.mouseEnteredHandler(event);
                    });

                canvas.addEventListener("mouseleave", function (event) {
                    callbacks.mouseLeaveHandler(event);
                });

                canvas.addEventListener('wheel', function (event) {
                        callbacks.scrollEventHandler(event)
                        return false;
                    }, false
                );

                document.addEventListener("keypress",
                    function (event) {
                        callbacks.keyPressHandler(event);
                    });



                function drawLoop() {

                    mCtx.fillStyle = "#eeeeee";
                    mCtx.fillRect(0, 0, global.WIDTH, global.HEIGHT);
                    console.log("drawing");
                    mCtx.fillStyle = "#ee0000";
                    mCtx.strokeStyle = "#393939";
                    mTransform.pipelineTransform(inputVertices, outputVertices, viewCoordCaptures);

                    if(FZIindicator.redraw){

                        meshUtil.drawFaceWithZOrder(mCtx, outputVertices, faces);
                        console.log( "faces are: ", faces );
                        // FZIindicator.disableRedraw(); /*disable redraw after one full cycle*/
                    }

                    requestAnimationFrame(drawLoop);
                }

                drawLoop();

            }
        );
    });


}


window.onload = main;