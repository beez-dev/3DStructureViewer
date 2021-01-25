import * as mUtils from './utils/utils.js';
import {Vec4} from "./utils/mathObjects.js";


class ObjParser {
    /*
    * input element - input element containing files
    * */
    constructor(inputElement, onReady=null) {
        //this.inputElement = inputElement;
        this.setStatus(ObjParser.STATUS_EMPTY);
        this.selectedFiles = [];
        this.processedNoOfFiles = 0;
        this.objectData = {};
        this.onReady = null;
        if( onReady!=null ) {
            this.onReady = onReady;
        }

        // this.vertexTextureCoords = {};
        // this.vertexNormals = {};
        Array.from(inputElement.files).forEach(file => {
            /* loose checks for obj files */
            if ( file.name.endsWith(ObjParser.OBJ_EXTENSION) ) {
                if (file.type === ObjParser.OBJ_FILE_TYPE) {
                    this.getSelectedFiles().push(file);
                    this.getObjectData()[file.name] = {};
                } else {
                    console.log(file.name + " is not a valid 3D obj file");
                }
            } else {
                if (file.name.endsWith(ObjParser.OBJ_MATERIAL_FORMAT)) {
                    console.log(file.name + " is a wavefront material file. Materials are currently not supported");
                } else {
                    console.log(file.name + " is not a valid 3D obj file");
                }
            }
        });


        this.totalFiles = this.getSelectedFiles().length;
        if(this.totalFiles === 0){alert('No valid file(s) have been selected');return;};

        this.getSelectedFiles().forEach(file => {
            let dataSlot = this.getObjectData()[file.name];
            this.parseFile(dataSlot, file);
        });

    }

    getReadyStateCallback(){
        return this.onReady;
    }

    getObjectData() {
        return this.objectData;
    }

    getAllFileNames() {
        let allFiles = [];
        for (let eachFile in this.getObjectData()) {
            allFiles.push(eachFile);
        }
        return allFiles;
    }

    getObjectNamesInFile(fileName) {
        let allObjects = [];
        console.log("object data: ", (this.getObjectData()['cube.obj'])['Cube_Cube.001'] );
        for (let eachObject in this.getObjectData()[fileName]) {
            allObjects.push(eachObject);
        }
        return allObjects;
    }

    getObjectAttributes(fileName, objectName, attribute){
        return this.getObjectData()[fileName][objectName][attribute];
    }

    parseFile(dataSlot, file) {
        let fileReader = new FileReader();
        let rawFileData = '';
        fileReader.onload = function () {
            rawFileData = fileReader.result;
            fileReader = null;//release memory
            if (rawFileData !== '') {
                if( this.extractData(dataSlot, rawFileData) ){ /*at least one file has at least one object with properties*/
                    this.setStatus(ObjParser.STATUS_PENDING);
                }

                if( this.getStatus() === ObjParser.STATUS_READY ){
                    let callback = this.getReadyStateCallback();
                    if(callback!=null){
                        callback();
                    }
                }

            }
        }.bind(this);

        fileReader.onerror = function () {
            console.log(`The file ${file.name} is corrupt or has unidentifiable encoding`);
        };
        fileReader.readAsText(file);
    }

    getAvailableFileNames(){
        return Object.keys(this.getObjectData());
    }

    getAvailableObjectNames(filename){
        return Object.keys(this.getObjectData()[filename]) ;
    }

    getAllVertices(filename, objectName){
        return this.getObjectData()[filename][objectName][ ObjParser.OBJ_VERT_CMD ];
    }

    getAllFvis( filename, objectName ){
        return this.getObjectData()[filename][objectName][ ObjParser.OBJ_FVI_mCMD ];
    }

    extractData(dataSlot, rawData) {
        //vertices may be in different groups
        rawData = rawData.trim().split( /\r\n|\n/ );
        let currentObjectDataSlot = null;
        rawData.forEach( line => {

            if (mUtils.StringUtils.beginsExact(line, ObjParser.OBJ_OBJECT_CMD, ' ')) {
                let objectName = line.split(' ')[ObjParser.OBJ_DATA_INDEX];
                dataSlot[objectName] = {};
                currentObjectDataSlot = dataSlot[objectName];
                this.getObjectProperties()
                    .forEach( function (objectProperty) {
                        currentObjectDataSlot[objectProperty] = [];
                    } );

            } else if (mUtils.StringUtils.beginsExact(line, ObjParser.OBJ_VERT_CMD, ' ')) {
                let singleVertex = new Vec4();
                let vertexInfo = line.trim().split(' ');
                for (let i = ObjParser.OBJ_DATA_INDEX; i < vertexInfo.length; i++) {
                    singleVertex.iSet( i-ObjParser.OBJ_DATA_INDEX, parseFloat(vertexInfo[i]) );
                }
                currentObjectDataSlot[ObjParser.OBJ_VERT_CMD].push(singleVertex);

            } else if (mUtils.StringUtils.beginsExact(line, ObjParser.OBJ_FACE_CMD, ' ')) {
                let singleFVI = [];
                // single FVTI and FVN declaration HERE - added when support for texture coordinate is implemented

                let faceInfo = line.trim().split(' ');
                for ( let i = ObjParser.OBJ_DATA_INDEX; i < faceInfo.length; i++ ) {

                    let eachIndexGroup = faceInfo[i].trim().split('/');
                    let FVIIndex = parseInt(eachIndexGroup[ObjParser.OBJ_FVI_POSITION]) + ObjParser.OBJ_INDEX_FIX;

                    // Add variables for texture coordinates and normals HERE

                    singleFVI.push(FVIIndex);
                }
                currentObjectDataSlot[ObjParser.OBJ_FVI_mCMD].push(singleFVI);
            }
        });



        this.updateProcessedFileCount();

        if(currentObjectDataSlot === undefined ||
           Object.entries(currentObjectDataSlot[ObjParser.OBJ_VERT_CMD]).length === 0 ){
            return false;
        }

        return true;

    }

    // extractTextureCoords and normals remain

    getProcessedFileCount() {
        return this.processedNoOfFiles;
    }

    updateProcessedFileCount() {
        this.processedNoOfFiles += 1;
    }

    getTotalFileCount() {
        return this.totalFiles;
    }

    getSelectedFiles() {
        return this.selectedFiles;
    }

    setStatus(fileStatus) {
        this.processingStatus = fileStatus;
    }


    /*
    * gets the names of all the parsed object
    * properties available through the ObjParser
    * */
    getObjectProperties() {
        return [ObjParser.OBJ_VERT_CMD, ObjParser.OBJ_FVI_mCMD];
    }

    getStatus() {
        /* if the file contains at least one object
        * and the valid files are all processed
        * then mark the status as ready*/
        if((this.processingStatus === ObjParser.STATUS_PENDING) &&
            (this.getProcessedFileCount() === this.getSelectedFiles().length) ){
            this.setStatus(ObjParser.STATUS_READY);
        }
        return this.processingStatus;
    }

    /* GETTERS- REPLACEMENT FOR STATIC VARIABLES*/

    static get OBJ_MAX_VERT_COUNT() {
        return 1000;
    }

    /*
    * OBJ files number vertices from 1,
    * while we index them starting from 0
    * */
    static get OBJ_INDEX_FIX() {
        return -1;
    }

    static get OBJ_FACE_CMD() {
        return 'f';
    }

    /*
    * getFVI - get Face Vertex Index
    * Parsed property: face vertex index
    * groups the vertex indices that construct a face
    * note: .obj format indexes faces beginning from 1
    * but, js begins indexing from 0, so, -1 addition is necessary
    * ::
    * the `m` stands for not a standard obj command, used as command
    * denoter for parsed values
    * */
    static get OBJ_FVI_mCMD() {
        return 'fvi';
    }

    /*
    * constant 0;
    * position in the f x/y/z face to vert,tex coord, normal
    * index grouping system*/
    static get OBJ_FVI_POSITION() {
        return 0;
    }

    static get OBJ_NORM_CMD(){
        return 'vn';
    }

    static get OBJ_VERT_CMD() {
        return 'v';
    }


    static get OBJ_OBJECT_CMD() {
        return 'o';
    }

    static get OBJ_DATA_INDEX() {
        return 1;
    }

    static get OBJ_EXT() {
        return '.obj';
    }

    static get STATUS_EMPTY() {
        return '__EMPTYYTPME__';
    }

    static get STATUS_PENDING() {
        return '__PENDDNEP__';
    }

    static get STATUS_READY() {
        return '__READYYDAER__';
    }

    static get OBJ_FILE_TYPE() {
        return 'application/x-tgif';
    }

    static get OBJ_EXTENSION() {
        return '.obj';
    }

    static get OBJ_MATERIAL_FORMAT() {
        return '.mtl';
    }

}


export {ObjParser};