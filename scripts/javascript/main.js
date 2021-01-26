import {ObjParser} from "./ObjParser.js";
import {MeshUtils} from "./utils/meshUtils.js";
import {Vec2, Vec3, Vec4} from "./utils/mathObjects.js";
import {Transformation} from "./transformation.js";
import * as global from "./GLOBALs.js";
import {mCamera} from "./GLOBALs.js";
import {EventCallback} from "./eventCallbacks.js";

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
                for (let i = 0; i < inputVertices.length; i++) {
                    outputVertices[i] = new Vec4();
                }
                let fvis = parser.getAllFvis(filename, objectName);

                canvas.addEventListener("mousedown",function(event){
                    callbacks.mouseDownHandler(event.clientX, event.clientY);
                });

                canvas.addEventListener("mouseup", function(event){
                   callbacks.mouseUpHandler(event.clientX, event.clientY);
                });

                canvas.addEventListener('mousemove',
                    function(event){
                        callbacks.cameraTranslate(mCamera, event.clientX, event.clientY);
                    }.bind(this));

                window.addEventListener("keydown",
                    function(event){
                        if(event.code==='KeyW') {
                            mCamera.P.z += .01;
                        }else if(event.code === "KeyS"){
                            mCamera.P.z -= .01;
                        }else if(event.code === "KeyA"){
                            mCamera.P.x += .01;
                        }else if(event.code === "KeyD"){
                            mCamera.P.x -= .01;
                        }
                    });

                let xMan = 0.01;
                let xManRadius = 10;
                function drawLoop() {
                    mCtx.fillStyle = "#eeeeee";
                    mCtx.fillRect(0, 0, global.WIDTH, global.HEIGHT);
                    console.log("drawing");
                    mCamera.P.z = Math.sin(xMan) * xManRadius;
                    mCamera.P.x = Math.cos(xMan) * xManRadius;
                    xMan += 0.01;

                    mTransform.pipelineTransform(inputVertices, outputVertices);
                    meshUtil.drawFaceStroke(mCtx, outputVertices, fvis);

                    requestAnimationFrame(drawLoop);
                }

                drawLoop();

            }
        );
    });




}


window.onload = main;