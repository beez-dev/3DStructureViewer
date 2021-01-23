import * as mUtils from './utils.js';


class ObjParser {

    constructor(inputElement) {
        //this.inputElement = inputElement;
        this.fileStatus = this.setFileStatus(ObjParser.EMPTY);
        this.selectedFiles = [];
        this.processedNoOfFiles = 0;
        this.objectData = {};


        //this.vertexTextureCoords = {};
        //this.vertexNormals = {};
        Array.from(inputElement.files).forEach(file => {
            /* loose checks for obj files */
            if (file.name.endsWith(ObjParser.OBJ_EXTENSION)) {
                if (file.type === ObjParser.OBJ_FILE_TYPE) {
                    this.getSelectedFiles().push(file);
                    this.getObjectData()[file.name] = {};
                }else{
                    console.log(file.name+" is not a valid 3D obj file");
                }
            } else {
                if(file.name.endsWith(ObjParser.OBJ_MATERIAL_FORMAT)) {
                    console.log(file.name+" is a wavefront material file. Materials are currently not supported");
                }else{
                    console.log(file.name+" is not a valid 3D obj file");
                }
            }
        });
        this.totalFiles = this.getSelectedFiles().length;

        this.getSelectedFiles().forEach(file => {
            let dataSlot = this.getObjectData()[file.name];
            this.parseFile(dataSlot, file);
        });

        console.log("Object data: ", this.getObjectData());
    }

    getObjectData() {
        return this.objectData;
    }


    parseFile(dataSlot, file) {
        let fileReader = new FileReader();
        let rawFileData = '';
        fileReader.onload = function () {
            rawFileData = fileReader.result;
            fileReader = null;//release memory
            if (rawFileData !== '') {
                this.extractData(dataSlot, rawFileData);
            }
        }.bind(this);

        fileReader.onerror = function () {
            console.log(`The file ${file.name} is corrupt or has unidentifiable encoding`);
        };
        fileReader.readAsText(file);
    }


    extractData(dataSlot, rawData) {
        //vertices may be in different groups
        rawData = rawData.trim().split(/\r\n|\n/);
        let currentObjectDataSlot = null;
        rawData.forEach( line=>{

            if(mUtils.StringUtils.beginsExact(line, ObjParser.OBJ_OBJECT_CMD, ' ')  ){
               let objectName = line.split(' ')[ObjParser.OBJ_DATA_INDEX];
               currentObjectDataSlot = dataSlot[objectName]={};
               this.getObjectProperties()
                   .forEach(function(objectProperty){
                         currentObjectDataSlot[objectProperty]=[];
                   });

            }else if(mUtils.StringUtils.beginsExact(line, ObjParser.OBJ_VERT_CMD, ' ')){
                let singleVertex = [];
                let vertexInfo = line.trim().split(' ');
                for(let i = ObjParser.OBJ_DATA_INDEX; i < vertexInfo.length; i++){
                    singleVertex.push(parseFloat(vertexInfo[i]));
                }
                currentObjectDataSlot[ObjParser.OBJ_VERT_CMD].push( singleVertex );

            }else if (mUtils.StringUtils.beginsExact(line, ObjParser.OBJ_FACE_CMD, ' ')) {
                let singleFVI = [];
                // single FVTI and FVN declaration HERE - added when support for texture coordinate is implemented
                let faceInfo = line.trim().split(' ');
                for(let i = ObjParser.OBJ_DATA_INDEX; i < faceInfo.length; i++){

                    let eachIndexGroup = faceInfo[i].trim().split('/');
                    let FVIIndex = parseInt(eachIndexGroup[ObjParser.OBJ_FVI_POSITION]) + ObjParser.OBJ_INDEX_FIX;

                    // Add variables for texture coordinates and normals HERE

                    singleFVI.push(FVIIndex);
                }
                currentObjectDataSlot[ObjParser.OBJ_FVI_mCMD].push(singleFVI);
            }
        } );

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

    setFileStatus(fileStatus) {
        this.fileStatus = fileStatus;
    }


    /*
    * gets the names of all the parsed object
    * properties available through the ObjParser
    * */
    getObjectProperties(){
        return [ObjParser.OBJ_VERT_CMD, ObjParser.OBJ_FVI_mCMD];
    }

    getFileStatus() {
        return this.fileStatus;
    }

    /* GETTERS- REPLACEMENT FOR STATIC VARIABLES*/

    static get OBJ_MAX_VERT_COUNT(){
        return 1000;
    }

    /*
    * OBJ files number vertices from 1,
    * while we index them starting from 0
    * */
    static get OBJ_INDEX_FIX(){
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
    static get OBJ_FVI_mCMD(){
        return 'fvi';
    }

    /*
    * constant 0;
    * position in the f x/y/z face to vert,tex coord, normal
    * index grouping system*/
    static get OBJ_FVI_POSITION(){
        return 0;
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

    static get OBJ_MATERIAL_FORMAT(){
        return '.mtl';
    }

}


function main(){
    const inputElement = document.querySelector('input[type=file]');
    let mVar = new ObjParser(inputElement);

}

window.onload = main;