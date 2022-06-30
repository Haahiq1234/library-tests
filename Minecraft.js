var Items;
loadFile("Items.json", function (e, t) {
    if (e) {
        console.log(e);
    } else {
        Items = JSON.parse(t);
    }
})
var texture = loadImage("Sprite Atlas.png");
class Chunk {
    mesh;
    blocks = {};

    xwidth;
    zwidth;
    height;
    chunkPos;
    pos;

    constructor(x, y) {
        this.chunkPos = new Vector2(x, y);
        this.mesh = new Mesh();
        this.mesh.texture = texture;
        this.blocks = {};
    }
    Init(controller) {
        this.controller = controller;
        this.xwidth = controller.xwidth;
        this.zwidth = controller.zwidth;
        this.height = controller.height;
    }
    posi() {
        let p = new Vector2(this.chunkPos.x * this.xwidth, this.chunkPos.y * this.zwidth);
        //console.log(p);
        return p;
    }
    addBlock(x, y, z, id, replace = false) {
        let pos = new Vector3(x, y, z);
        let ind = pos.index();
        if (!this.blocks.hasOwnProperty(ind) || replace) {
            this.blocks[ind] = id;
        }
    }
    generate() {
        let pos = this.posi();
        //console.log(pos);
        for (var x = pos.x; x < pos.x + this.xwidth; x++) {
            for (var z = pos.y; z < pos.y + this.zwidth; z++) {
                //console.log(x, z);
                this.addBlock(x, 0, z, 1);
                this.addBlock(x, 1, z, 1);
                //for () {

                //}
            }
        }
    }
    build() {
        this.mesh.vertices = [];
        this.mesh.uvs = [];
        this.mesh.indices = [];
        for (let ind in this.blocks) {
            let id = this.blocks[ind];
            let pos = Vector.fromIndex(ind);
            if (this.controller.getBlock(pos.x, pos.y + 1, pos.z) == -1) {
                let u = Items[id].top.x;
                let v = Items[id].top.y;
                console.log(u, v);
                let s = 1;
                this.addFace([
                    floor(pos.x * s + 1.0), pos.y * s + 1.0, pos.z * s - 1.0,
                    floor(pos.x * s - 1.0), pos.y * s + 1.0, pos.z * s - 1.0,
                    floor(pos.x * s - 1.0), pos.y * s + 1.0, pos.z * s + 1.0,
                    floor(pos.x * s + 1.0), pos.y * s + 1.0, pos.z * s + 1.0
                ], u, v);
            }
        }
        this.mesh.build();
    }
    addFace(verts, u, v) {
        let len = this.mesh.vertices.length;
        let indices = [len, len + 1, len + 2, len, len + 2, len + 3];
        this.mesh.vertices.push(...verts);
        this.mesh.indices.push(...indices);
        this.mesh.uvs.push(
            u, v,
            u + 0.1, v,
            u + 0.1, v + 0.1,
            u, v + 0.1
        );
    }
    draw() {
        this.mesh.bind();
        this.mesh.draw();
    }
    getBlock(x, y, z) {
        let pos = new Vector3(x, y, z);
        let ind = pos.index();
        if (ind in this.blocks) {
            return this.blocks[ind];
        }
        return -1;
    }
}
class Controller {
    chunks = {};
    constructor(smoothness, hscale, minHeight, xwidth = 16, zwidth = 16, chunkHeight = 256) {
        this.smoothness = smoothness;
        this.hscale = hscale;
        this.xwidth = xwidth;
        this.zwidth = zwidth;
        this.chunkHeight = chunkHeight;        
    }
    addChunk(x, z) {
        let pos = new Vector2(x, z);
        let ind = pos.index();
        if (ind in this.chunks) {
            return;
        }
        let chunk = new Chunk(x, z)
        chunk.Init(this);
        chunk.generate();
        chunk.build();
        this.chunks[ind] = chunk;
    }
    calculateChunkPos(x, z) {
        let pos = new Vector2(floor(x / this.xwidth), floor(z / this.zwidth));
        return pos;
    }
    draw() {
        for (var chunk in this.chunks) {
            this.chunks[chunk].draw();
        }
    }
    getBlock(x, y, z) {
        let pos = this.calculateChunkPos(x, z);
        let ind = pos.index();
        if (ind in this.chunks) {
            let chunk = this.chunks[ind];
            return chunk.getBlock(x, y, z);
        }
        return -1;
    }
}