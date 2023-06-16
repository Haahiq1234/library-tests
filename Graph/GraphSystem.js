class GraphSystem {
    constructor() {
        this.system = new CameraSystem();
        this.system.scaleY = -5;
        this.system.scaleX = 5;
        var graph = this;
        on.start.bind(function() {graph.init()});

        this.minsize = 25;
        this.maxsize = 75;

        this.size = 50;
        var graph = this;
        // on.wheel.bind(function(delta) {
        //     //graph.size = graph.calculateSize();
        //     //graph.zoom();
        // });
    }
    init() {
        console.log("Hello");
        this.system.y = CanvasHeight;
    }
    update() {
        this.system.update();


        let x = this.system.transformx(0);
        let y = this.system.transformy(0);

        saveLineState();
        saveColor();

        lineWidth(3);
        stroke(0);

        line(0, y, CanvasWidth, y);
        line(x, 0, x, CanvasHeight);

        //this.drawgrid();

        loadLineState();
        loadColor();
    }
    drawgrid() {
        nofill();
        let p = this.system.transform(0, 0);
        rect(p.x, p.y, this.size, -this.size);
        lineWidth(1);
        stroke(0);
        text(this.size, p.x + this.size, p.y + 10);
    }
    calculateSize() {
        let size = (50 / this.system.zoomed);
        if (size > this.maxsize) {
            size -= size % this.maxsize;
        }

        return size;
    }
    graph(f, d, r=2) {
        stroke(100);
        lineWidth(2);
        let px = this.system.deformx(0);
        let py = f(px);
        for (var i = 1; i < CanvasWidth; i+=r) {
            let x = this.system.deformx(i);
            let y = f(x);
            this.system.line(px, py, x, y);
            px = x;
            py = y;
        }
        let mx = this.system.deformx(mouse.x);
        let my = f(mx);


        let dy = d(mx) * this.system.scaleY;

        let p = this.system.transform(mx, my);
        const length = mag(this.system.scaleX, dy);
        const scale = 100 / length;
        lineWidth(2);
        stroke(0);
        line(p.x - scale * this.system.scaleX, p.y - dy * scale, p.x + scale * this.system.scaleX, p.y + dy * scale);

        circle(p.x, p.y, 5);
        text(`(${floor(mx, 0.001)}, ${floor(my, 0.001)})`, p.x + 50, p.y + 20);
    }
}