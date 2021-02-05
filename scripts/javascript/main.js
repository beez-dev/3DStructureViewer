import * as global from "./init.js";
import {FZI} from "./zIndexSorting.js";
import {ObjParser} from "./ObjParser.js";
import {EventCallback} from "./eventCallbacks.js";
import {Transformation} from "./transformation.js";
import {Face, MeshUtils} from "./utils/meshUtils.js";
import {Vec2, Vec3, Vec4} from "./utils/mathObjects.js";
import {TransformUtils} from "./utils/transformationUtils.js";
import {State, mainCamera, modelSurfaceColorChooser, modelWireColorChooser,
                            callbacks,canvasBgColorChooser} from "./init.js";





function mainEvent(e) {

    let canvas = document.querySelector('#masterCanvas');
    let mCtx = document.querySelector('#masterCanvas').getContext('2d');
    let width = global.WIDTH;
    let height = global.HEIGHT;

    let mTransform = new Transformation();

    mCtx.canvas.width = width;
    mCtx.canvas.height = height;

    mCtx.fillStyle = `${State.canvasBackgroundColor}`;
    mCtx.fillRect(0, 0, global.WIDTH, global.HEIGHT);

    let input = document.getElementById('uploadModelButton-real');
    let meshUtil = new MeshUtils();
    let parser = null;

    mCtx.clearRect(0, 0, width, height);
    parser = new ObjParser( e,
        function () {

            /*remove the start screen*/
            if (State.startScreenBrowsed) {
                document.querySelector("#startScreen").style.transform = `translate(-${global.WIDTH}px)`;
                document.querySelector("#startScreen").style.opacity = 0;
                State.startScreenBrowsed = false;/*reset value required to avoid unnecessary translation*/

            }

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

            /*console.log( "fvis: ", fvis );
            console.log( "faces: ", faces );
            console.log( "viewCoordCaptures: ", viewCoordCaptures );*/

            for (let i = 0; i < fvis.length; i++) {
                faces[i] = new Face(fvis[i]);
                let eachFvi = fvis[i];
                for (let j = 0; j < eachFvi.length; j++) {
                    /*stick the references of view space vertices
                    to in their face objects*/
                    faces[i].viewSpaceVertices.push(viewCoordCaptures[eachFvi[j]]);
                }
            }

            canvas.addEventListener("mousedown",
                function (event) {
                    forceRedraw();
                    callbacks.mouseDownHandler(event);
                });

            canvas.addEventListener("mouseup",
                function (event) {
                    forceRedraw();
                    callbacks.mouseUpHandler(event);
                });

            canvas.addEventListener("mousemove",
                function (event) {
                    callbacks.mouseMoveHandler(event, () => forceRedraw());
                }.bind(this));

            canvas.addEventListener("mouseenter",
                function (event) {
                    // forceRedraw();
                    callbacks.mouseEnteredHandler(event);
                });

            canvas.addEventListener("mouseleave", function (event) {
                // forceRedraw();
                callbacks.mouseLeaveHandler(event);
            });

            canvas.addEventListener('wheel', function (event) {
                forceRedraw();
                callbacks.scrollEventHandler(event);
                return false;
            }, false);

            callbacks.translateLastX = document.getElementById("translateX").value;/*retain all repositioned values*/
            callbacks.translateLastY = document.getElementById("translateY").value;
            callbacks.translateLastZ = document.getElementById("translateZ").value;
            callbacks.lastScale = document.getElementById("scale").value;
            callbacks.lastRotX = document.getElementById("RotX").value;
            callbacks.lastRotY = document.getElementById("RotY").value;

            document.getElementById("clampYRotCheckbox").addEventListener(
                'click', function(event){
                    callbacks.clampYRotHandler(event);
                }
            )

            document.getElementById("canvasBackgroundColor-real").oninput = function () {
                callbacks.colorChooserHandler(this, "canvasBackgroundColor", canvasBgColorChooser);
            }

            document.getElementById("modelWireColor-real").oninput = function () {
                callbacks.colorChooserHandler(this, "modelWireColor", modelWireColorChooser);
            }


            document.getElementById("modelSurfaceColor-real").oninput = function () {
                callbacks.colorChooserHandler(this, "modelSurfaceColor", modelSurfaceColorChooser);
            }


            document.getElementById("translateX").oninput = function () {
                callbacks.sliderTranslateHandler(State.TRANSLATE_X, this, document.getElementById("translateMultiplier"));
            };

            document.getElementById("translateY").oninput = function () {
                callbacks.sliderTranslateHandler(State.TRANSLATE_Y, this, document.getElementById("translateMultiplier"));
            };

            document.getElementById("translateZ").oninput = function () {
                callbacks.sliderTranslateHandler(State.TRANSLATE_Z, this, document.getElementById("translateMultiplier"));
            };

            document.getElementById("scale").oninput = function () {
                callbacks.sliderScaleHandler(this, document.getElementById("scaleMultiplier"));
            }


            document.getElementById("RotX").oninput = function () {
                callbacks.sliderRotationHandler(State.ROT_X, this, document.getElementById("rotationMultiplier"));
            }

            document.getElementById("RotY").oninput = function () {
                callbacks.sliderRotationHandler(State.ROT_Y, this, document.getElementById("rotationMultiplier"));
            }


            document.getElementById("burgerIcon").addEventListener("click",
                function (event) {
                    callbacks.burgerMenuHandler(event);
                });

            document.getElementById("closeSettingPanel").addEventListener("click",
                function (event) {
                    callbacks.closeSettingPanelHandler(event);
                });


            document.getElementsByClassName("rotateIcon")[0].addEventListener("click",
                function (event) {
                    callbacks.autoRotationHandler(event);
                });


            document.getElementsByClassName("projectionSwitch")[0].addEventListener("click",
                function (event) {
                    callbacks.projectionSwitchHandler(event);
                });

            document.getElementsByClassName("shadingTypeSelection")[0].addEventListener("click",
                function (event) {
                    callbacks.shadingSelectionHandler(event);
                });


            function forceRedraw() {
                State.enableRedraw();
                drawLoop();
            }

            /* State(init.js) and meshUtils(meshUtils.js) variables
             required for draw operation */

            State.forceRedraw = () => forceRedraw();
            meshUtil.shadeFlatParams = [mCtx, outputVertices, fvis];
            meshUtil.shadeWireParams = [mCtx, outputVertices, fvis];
            meshUtil.shadeFlatWireParams = [mCtx, outputVertices, faces];

            function drawLoop() {

                if (State.redraw) {
                    mCtx.fillStyle = `${State.canvasBackgroundColor}`;
                    mCtx.fillRect(0, 0, global.WIDTH, global.HEIGHT);
                    mCtx.fillStyle = `${State.modelSurfaceColor}`;
                    mCtx.strokeStyle = `${State.modelWireColor}`;
                    mTransform.pipelineTransform(inputVertices, outputVertices, viewCoordCaptures);

                    meshUtil.drawUsing(State.currentShadingType);

                    // meshUtil.drawFaceWithZOrder(mCtx, outputVertices, faces);
                    // meshUtil.drawFaceStroke(mCtx,outputVertices,fvis);
                    // meshUtil.drawFaceFill(mCtx,outputVertices,fvis);

                    State.disableRedraw(); /*disable redraw after one full cycle*/
                    // requestAnimationFrame(drawLoop);
                }
            }

            drawLoop();

        }
    );
}

function main(){

    document.getElementById('uploadModelButton-real').addEventListener('change',
        (e)=>mainEvent(e)
    );


}


window.onload = main;


export{mainEvent}