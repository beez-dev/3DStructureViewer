import {ObjParser} from "./ObjParser.js";
import {MeshUtils} from "./utils/meshUtils.js";
import {Vec2, Vec3, Vec4} from "./utils/mathObjects.js";
import {Transformation} from "./transformation.js";
import * as global from "./GLOBALs.js";
import {FZIindicator, mTrackballCamera} from "./GLOBALs.js";
import {EventCallback} from "./eventCallbacks.js";
import {TransformUtils} from "./utils/transformationUtils.js";
import {FZI} from "./zIndexSorting.js";


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
        parser = new ObjParser(e.target,
            function () {
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
                /*each fvi subarray is of length atleast 3 - guaranteed*/
                let fvis = parser.getAllFvis(filename, objectName);

                /*fzi- face to zIndex mapper, see zIndexSorting.js */
                let fzis = new Array(fvis.length);
                for(let i = 0; i < fvis.length; i++){
                    fzis[i] = new FZI();
                }


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





                setInterval(
                function drawLoop() {
                    mCtx.fillStyle = "#eeeeee";
                    mCtx.fillRect(0, 0, global.WIDTH, global.HEIGHT);
                    console.log("drawing");
                    mCtx.fillStyle = "#ee0000";
                    mCtx.strokeStyle = "#393939";
                    mTransform.pipelineTransform(inputVertices, outputVertices, fvis, fzis, viewCoordCaptures);

                    // meshUtil.drawWithBackfaceCulling(mCtx, outputVertices, fvis);
                    // meshUtil.drawFaceFillStroke(mCtx,outputVertices,fvis);

                    if(FZIindicator.redraw){
                        meshUtil.drawFaceWithFZI(mCtx, outputVertices, fvis, fzis);
                        // FZIindicator.disableRedraw(); /*disable redraw after one full cycle*/
                    }
                }, 5000);

                // drawLoop();

            }
        );
    });


}


window.onload = main;