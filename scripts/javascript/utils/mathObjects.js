class Vector{
    constructor(){
    }

    /*gets magnitude of the vector*/
    getMagnitude(){
        let magnitude = 0;
        this.getCoords().forEach(
            function(coord){
                magnitude += Math.pow(coord, 2);
            }
        );

        return magnitude;
    }

    getCoords(){
        return [];
    }
}

class Vec2 extends Vector{
    constructor(x, y) {
        super();
        this.X = x;
        this.Y = y;
    }

    get x(){return this.X};
    get y(){return this.Y};

    setX(x){this.X = x;}
    setY(y){this.Y = y;}

    /*
    * sets value of coords with the help of index
    * x=0;y=1;z=2,w=3
    * */
    iSet(i, value){
        if(i===this.xIndex){
            this.setX(value);
        }else if(i === this.yIndex){
            this.setY(value);
        }
    }

    getCoords() {
        return [this.x, this.y];
    }

    get xIndex(){
        return 0;
    }

    get yIndex(){
        return 1;
    }

}

class Vec3 extends Vec2{
    constructor(x=0, y=0, z=0) {
        super(x, y);
        this.Z = z;
    }

    get z(){return this.Z};

    setZ(z){
        this.Z = z;
    }

    iSet(i, value){
        super.iSet(i, value);
        if(i === this.zIndex){
            this.Z = value;
        }
    }

    getCoords() {
        return [this.x,this.y,this.z];
    }

    getVec2(){
        return new Vec2(this.x,this.y);
    }

    get zIndex(){
        return 2;
    }

}

class Vec4 extends Vec3{
    constructor(x=0, y=0, z=0, w=1){
        super(x, y, z);
        this.W = w;
    }

    /*
    * gets only the x, y and z values in an array
    * */
    getVec3(){
        return new Vec3(this.x, this.y, this.z);
    }

    get w(){return this.W};

    setW(w){this.W = w;}


    iSet(i, value){
        super.iSet(i, value);
        if(i === this.wIndex){
            this.setW(value);
        }
    }

    getCoords() {
        return [this.x,this.y,this.z,this.w];
    }

    /*
     * index of w;
     * */
    get wIndex(){
        return 3;
    }

}

export {Vec2, Vec3, Vec4};