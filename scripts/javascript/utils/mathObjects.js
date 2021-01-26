class Vector {
    constructor() {
        /*
        * denotes if a vector is 2D, 3D or 4D
        * */
        this.totalVecComponents = this.getTotalAxes();
    }

    /*
    * gets the total number of coordinate axes,
    * in turn denoting if a vector is 2D, 3D or 4D
    * */
    getTotalAxes(){
        return this.getCoords().length;
    }


    getCoords() {
        return [];
    }

    /*
    * produces the square upto and not including the i-th component of the vector;
    * example in H = vec3(a, b, c, d), calling
    * getIMagnitudeSquare(Vec2.zIndex) squares till the y component of the vector,
    * in above, it does the following:
    * result = square(H.a)+square(H.b) and returns the result
    *
    * CAUTION: use the static indexes available as static members Vec(2/3/4).(x/y/z)Index
    * */
    getIMagnitudeSquare(componentIndex=this.getTotalAxes()) {
        let coords = this.getCoords();
        let magnitude = 0;
        for (let i = 0; i < componentIndex; i++) {
            magnitude += Math.pow(coords[i], 2);
        }
        return magnitude
    }

    getIMagnitude(componentIndex=this.getTotalAxes()) {
        return Math.sqrt(this.getIMagnitudeSquare(componentIndex));
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

    set x(value){
        this.X = value;
    }

    set y(value){
        this.Y = value;
    }

    setX(x){this.X = x;}
    setY(y){this.Y = y;}

    /*
    * sets value of coords with the help of index
    * x=0;y=1;z=2,w=3
    * */
    iSet(i, value){
        if(i===Vec2.xIndex){
            this.setX(value);
        }else if(i === Vec2.yIndex){
            this.setY(value);
        }
    }

    getCoords() {
        return [this.x, this.y];
    }



    static get xIndex(){
        return 0;
    }

    static get yIndex(){
        return 1;
    }

}

class Vec3 extends Vec2{
    constructor(x=0, y=0, z=0) {
        super(x, y);
        this.Z = z;
    }

    get z(){return this.Z};

    set z(value){
        this.Z = value;
    }

    setZ(z){
        this.Z = z;
    }

    iSet(i, value){
        super.iSet(i, value);
        if(i === Vec3.zIndex){
            this.Z = value;
        }
    }



    getCoords() {
        return [this.x,this.y,this.z];
    }

    getVec2(){
        return new Vec2(this.x,this.y);
    }

    static get zIndex(){
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

    set w(value){
        this.W = value;
    }

    setW(w){this.W = w;}


    iSet(i, value){
        super.iSet(i, value);
        if(i === Vec4.wIndex){
            this.setW(value);
        }
    }



    getCoords() {
        return [this.x,this.y,this.z,this.w];
    }

    /*
     * index of w;
     * */
    static get wIndex(){
        return 3;
    }

}

export {Vec2, Vec3, Vec4};