var gl;// = new WebGLRenderingContext();
var program;
var vertexShaderText;
var fragmentShaderText;
class GLCamera {
    program;

    projUniformLoc;
    worldUniformLoc;
    viewUniformLoc;
    transformUL;
    velocity = new Vector3(0.5, 0.5, 0.5);
    yrotationspeed = 3;

    constructor(pos, dir, y) {
        this.y = new Vector3(...y);
        this.pos = new Vector3(...pos);
        this.dir = new Vector3(...dir);
        this.worldMatrix = Matrices.identity(4).Float32Array;
        //this.width = new F
    }
    setTransform(mat) {
        gl.uniformMatrix4fv(this.transformUL, gl.FALSE, mat);
    }
    updateController() {
        let ang = GetAxis("horizontal", "arrow") * this.yrotationspeed;
        //console.log(ang)
        this.rotate(0, ang, 0);

        let right;
        let forward = this.dir;
        forward = forward.copy().normalize();
        forward.y = 0;
        right = forward.copy();
        forward.mult(-GetAxis("vertical") * this.velocity.z);
        this.move(forward);

        let up = this.y;
        up = up.copy().normalize();
        up.mult(-GetAxis("vertical2") * this.velocity.y);
        this.move(up);

        right.normalize();
        //console.log(right);
        right.rotate(0, 90, 0);
        let xsp = GetAxis("horizontal", "key") * this.velocity.x;
        //console.log(right, xsp);
        right.mult(xsp);
        this.move(right);
        this.update();
    }
    rotateWorld(xr, yr, zr) {
        let xRot = Matrices.rotationX(xr);
        let yRot = Matrices.rotationY(yr);
        let zRot = Matrices.rotationZ(zr);

        let mat = Matrices.mult(xRot, yRot);
        mat = Matrices.mult(zRot, mat);
        mat = Matrices.mult(mat, new Matrix(4, 4, this.worldMatrix));
        this.worldMatrix = mat.Float32Array;
        gl.uniformMatrix4fv(this.worldUniformLoc, gl.FALSE, this.worldMatrix);
    }
    Init(prog, canvas) {
        this.program = prog;
        this.program.use();
        this.worldUniformLoc = this.program.getUL("mWorld");
        this.viewUniformLoc = this.program.getUL("mView");
        this.projUniformLoc = this.program.getUL("mProj");
        this.transformUL = this.program.getUL("transform");
        let identity = Matrices.identity(4);
        gl.uniformMatrix4fv(this.transformUL, gl.FALSE, identity.Float32Array);
        let projMatrix = new Float32Array(16);
        let viewMatrix = new Float32Array(16);
        matr4.lookAt(viewMatrix, this.eye, this.center, this.up);
        matr4.perspective(projMatrix, Angle.radians(45), canvas.width / canvas.height, .1, 1000.0);
        gl.uniformMatrix4fv(this.worldUniformLoc, gl.FALSE, this.worldMatrix);
        gl.uniformMatrix4fv(this.viewUniformLoc, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(this.projUniformLoc, gl.FALSE, projMatrix);
    }
    get eye() {
        return this.pos.array();
    }
    get center() {
        return this.pos.copy().add(this.dir).array();
    }
    rotate(xr, yr, zr) {
        this.dir.rotate(xr, yr, zr);
        //this.update();
    }
    set center(pos) {
        this.dir = new Vector3(...pos).copy().sub(this.pos);
    }
    get up() {
        return this.y.array();
    }
    update() {
        let view = new Float32Array(16);
        matr4.lookAt(view, this.eye, this.center, this.up);
        this.program.use();
        gl.uniformMatrix4fv(this.viewUniformLoc, gl.FALSE, view);
    }
    move(vel) {
        this.pos.add(vel);
    }
}
class Program {
    program;

    vertexShader;

    fragmentShader;

    constructor(fragText, vertText) {
        //console.log("created");
        this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
        this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(this.vertexShader, vertText);
        gl.shaderSource(this.fragmentShader, fragText);

        gl.compileShader(this.vertexShader);

        if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
            console.error("error Compiling vertex shader", gl.getShaderInfoLog(this.vertexShader));
        }

        gl.compileShader(this.fragmentShader);

        if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
            console.error("error Compiling fragment shader", gl.getShaderInfoLog(this.fragmentShader));
        }

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error("error linking program", gl.getProgramInfoLog(this.program));
            return;
        }

        gl.validateProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            console.error("Error validating program", gl.getProgramInfoLog(this.program));
            return;
        }
    }
    getAL(attr) {
        return gl.getAttribLocation(this.program, attr);
    }
    getUL(attr) {
        return gl.getUniformLocation(this.program, attr);
    }
    use() {
        gl.useProgram(this.program);
    }
}
loadFiles(["/shader.vs.glsl", "/shader.fs.glsl"], function (texts, errors) {
    if (errors.length > 0) {
        console.log(errors);
        return;
    }
    vertexShaderText = texts[0];
    fragmentShaderText = texts[1];
});
class Light {
    ambientCol;
    sunlightCol;
    direction;
    ambientUl;
    sunLightUl;
    directionUl;
    constructor() {
        this.ambientCol = color(0.4);
        this.sunlightCol = color(1.0);
        this.direction = new Vector3(0.0, 0.0, 1.0);
        program.use();
        this.ambientUl = program.getUL("ambientLight");
        this.sunLightUl = program.getUL("light.color");
        this.directionUl = program.getUL("light.direction");
        this.Update();
    }
    Update() {
        gl.uniform3f(this.ambientUl, ...this.ambientCol);
        gl.uniform3f(this.sunLightUl, ...ArrayMath.sub(this.sunlightCol, this.ambientCol));
        gl.uniform3f(this.directionUl, ...this.direction.array());
    }
}
function createGLCanvas(width, height) {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;
    GL.canvas = canvas;
    gl = canvas.getContext("webgl");
    program = new Program(fragmentShaderText, vertexShaderText);
    GL.colorAL = program.getAL("vertColor");
    GL.positionAL = program.getAL("vertPosition");
    GL.textureAL = program.getAL("textureCoord");
    GL.normalAL = program.getAL("normal");
    glCamera = new GLCamera([0, 0, -10], [0, 0, 1], [0, 1, 0]);
    glCamera.Init(program, canvas);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    program.use();

    new Light();
}
var glCamera;
var GL = {
    canvas: null,
    clearColor: function (...args) {
        let col = color(...args);
        let rgb = splitRGB(col);
        rgb.mult(1 / 255);
        gl.clearColor(rgb.r, rgb.g, rgb.b, rgb.a);
    },
    positionAL: null,
    colorAL: null,
    textureAL: null,
    normalAL: null
};
class Mesh {
    vertices;
    indices;
    colors;
    normals;
    uvs;

    uvbo;
    cbo;
    ibo;
    vbo;

    primitiveType;
    drawingVertices;

    _texture;

    constructor() {
        this._texture = new Material();
        this.vertices = [];
        this.indices = [];
        this.colors = [];
        this.colorPerIndex = false;
        this.transform = new Transform();
        this.uvs = [];
        this.lineColor = [255, 255, 0];
        this.smoothingStrength = 1;

        this.vbo = gl.createBuffer();
        this.ibo = gl.createBuffer();
        this.cbo = gl.createBuffer();
        this.uvbo = gl.createBuffer();
        this.nbo = gl.createBuffer();
    }
    buildFrameWork() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        let indices = getLinesFromFaces(this.indices);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        let colors = fillArray(this.vertices.length * 3, ...this.lineColor);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        let uvs = new Array(this.vertices.length * 2).fill(2.0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

        this.primitiveType = gl.LINES;
        this.drawingVertices = indices.length;
    }
    build() {

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        let vertices = this.verts;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        let cols = [];
        if (this.colors.length == 0 && !this.colorPerIndex) {
            cols = new Array(vertices.length).fill(1.0)
        } else if (this.colors.length == 0 && this.colorPerIndex) {
            cols = new Array(this.indices.length);
        } else {
            cols = joinArrays(this.colors);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cols), gl.STATIC_DRAW);

        if (this.uvs.length == 0) {
            this.uvs = new Array(vertices.length * 2).fill(2.0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);

        this.recalculateNormals();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

        this.primitiveType = gl.TRIANGLES;
        this.drawingVertices = this.indices.length;
    }
    set texture(image) {
        this._texture.texture = image;
    }
    bind() {
        this.transform.set();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.vertexAttribPointer(
            GL.positionAL,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(GL.positionAL);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvbo);
        
        gl.vertexAttribPointer(
            GL.textureAL,  //attribute location
            2,  //number of elements per attribute
            gl.FLOAT, //type of elements
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
            0  //size offset from beggining of vertex
        );

        gl.enableVertexAttribArray(GL.textureAL);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);

        gl.vertexAttribPointer(
            GL.normalAL,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        gl.enableVertexAttribArray(GL.normalAL);

        if (this.colorPerIndex) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }


        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbo);

        gl.vertexAttribPointer(
            GL.colorAL,  //attribute location
            3,  //number of elements per attribute
            gl.FLOAT, //type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
            0  //size offset from beggining of vertex
        );

        gl.enableVertexAttribArray(GL.colorAL);

        this._texture.bind();
    }
    get verts() {
        return Vector.array(...this.vertices);
    }
    recalculateNormals() {
        let vert = this.vertices;
        let norms = [];
        let avgs = new Array(this.vertices.length).fill(0);
        console.log(norms);
        for (var i = 0; i < vert.length; i++) {
            norms.push(new Vector3(0, 0, 0));
        }
        console.log(norms);
        //let norms2 = [];
        for (var i = 0; i < this.indices.length; i += 3) {
            let ai = this.indices[i + 0];
            let bi = this.indices[i + 1];
            let ci = this.indices[i + 2];
            let a = vert[ai];
            let b = vert[bi];
            let c = vert[ci];
            //console.log(ai, bi, ci, vert);
            let normal = Vector3D.normal(a, b, c);
            //console.log(a, b, c, normal);
            avgs[ai] += 1;
            avgs[bi] += 1;
            avgs[ci] += 1;
            norms[ai].add(normal);
            norms[bi].add(normal);
            norms[ci].add(normal);
        }
        for (var i = 0; i < norms.length; i++) {
            norms[i].div(avgs[i]);
        }
        console.log(...norms)
        this.normals = Vector.array(...norms);
    }
    draw() {
        //box.bind();
        gl.drawElements(this.primitiveType, this.drawingVertices, gl.UNSIGNED_SHORT, 0);
    }
}
function getLinesFromFaces(indices) {
    let vs = [];
    for (var i = 0; i < indices.length; i += 3) {
        let a = indices[i];
        let b = indices[i + 1];
        let c = indices[i + 2];
        vs.push(a, b, b, c, c, a);
    }
    return vs;
}
class Transform {
    position = new Vector3();
    scale = new Vector3(1, 1, 1);
    rotation = new Vector3();
    matrix;
    constructor() {
        this.matrix = Matrices.identity(4);
    }
    set() {
        this.update();
        glCamera.setTransform(this.matrix.Float32Array);
    }
    update() {
        this.matrix = Matrices.transform3(this.position, this.scale, this.rotation);
    }
}
class Material {
    _image;

    constructor(image) {
        this._texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (image) {
            this.image = image;
        }
    }
    set texture(image) {
        this._image = image;
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D
            (
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE,
                this._image.image
            );
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.activeTexture(gl.TEXTURE0);
    }
}