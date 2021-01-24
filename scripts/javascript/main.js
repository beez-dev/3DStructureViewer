import * as mParser from './ObjParser.js';

function main(){


    let mCtx = document.querySelector('canvas').getContext('2d');
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;

    mCtx.canvas.width = width;
    mCtx.canvas.height = height;

    mCtx.fillStyle = "#eeeeee";
    mCtx.fillRect( 0,0,width,height );

    let input = document.querySelector("input[type=file]");

    let parser = null;
    input.addEventListener('change', function (e) {
        parser = new mParser.ObjParser(e.target);
        console.log("file status from main: ", parser.getStatus());
        let objectData = parser.getObjectData();
    });

    /*let vertexData = [
        [-1.000000,-1.000000, 1.000000],
        [-1.000000, 1.000000, 1.000000],
        [-1.000000, -1.000000, -1.000000],
        [-1.000000, 1.000000 ,-1.000000],
        [1.000000, -1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000],
        [1.000000, -1.000000, -1.000000],
        [1.000000, 1.000000, -1.000000]
    ];

    let vertexIndex = [
        [1, 2, 4, 3],
        [3, 4, 8, 7],
        [7, 8, 6, 5],
        [5, 6, 2, 1],
        [3, 7, 5, 1],
        [8, 4, 2, 6]
    ];

    let mWidth = 600;
    let mHeight = 500;*/






}


window.onload = main;