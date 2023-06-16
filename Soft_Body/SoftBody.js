class SoftBody {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.springdata = [];
    }
    generate(width, height, distanceBetweenPoints, ks, kd, gravity, radius, extra) {
        this.width = width;
        this.height = height;
        this.ks = ks;
        this.kd = kd;
        this.radius = radius;
        this.physics = new Physics2DSystem();
        this.physics.gravity = gravity;
        this.bounds = new Rect(this.radius, this.radius, CanvasWidth - this.radius * 2, CanvasHeight - this.radius * 2);
        this.physics.addBounds(this.bounds);
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
               this.physics.addPoint(new Physics2DMassPoint(this.x + distanceBetweenPoints * i, this.y + distanceBetweenPoints * j));
            }
        }
        for (var i = 0; i < this.physics.points.length; i++) {
            let x = i % width;
            let y = (i - x) / width;
            this.addSpring(i, x + 1, y, true);
            this.addSpring(i, x,     y + 1, true);
            this.addSpring(i, x + 1, y + 1, true);
            this.addSpring(i, x - 1, y + 1, true);
        }
        if (extra) {
            //let mx = floorDiv(this.width, 2);
            //let my = floorDiv(this.height, 2);

            this.addSpring(0, this.width - 1, this.height - 1, true);
            this.addSpring(this.index(0, this.height - 1), this.width - 1, 0, true);

            //this.addSpring(this.index(mx, 0), mx, this.height - 1, false);
            //this.addSpring(this.index(0, my), this.width - 1, my, false);
        }
    }
    addSpring(i, x, y, show) {
        //console.log(x, y);
        if (this.inBounds(x, y)) {
          let j = this.index(x, y);
          this.physics.addSpring(
            new Physics2DSpring(
              this.physics.points[i],
              this.physics.points[j],
              this.ks,
              this.kd
            )
          );
          this.springdata.push(show);
        }
    }
    addForce(f) {
        if (f.mag() == 0) return;
        //console.log(f);
        for (var point of this.physics.points) {
            point.addForce(f);
        }
    }
    inBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    index(x, y) {
        return x + y * this.width;
    }
    update() {
        this.physics.update();
        for (var i = 0; i < this.physics.springs.length; i++) 
        {
            if (!this.springdata[i]) continue;
            let spring = this.physics.springs[i];
            line(spring.a.pos.x, spring.a.pos.y, spring.b.pos.x, spring.b.pos.y);
        }
        for (var point of this.physics.points) {
            circle(point.pos.x, point.pos.y, this.radius);
        }
    }
}