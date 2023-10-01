
class Toothpick {
    constructor(x, y, dir) {
        this.x = x;
        this.y = y;
        this.newPick = true;
        this.dir = dir;
        if (dir == 1) {
            this.ax = x;
            this.ay = y - len / 2;
            this.bx = x;
            this.by = y + len / 2;
        }
        if (dir == -1) {
            this.ax = x - len / 2;
            this.ay = y;
            this.bx = x + len / 2;
            this.by = y;
        }
    }
    show(factor) {
        stroke("black");
        lineWidth(3 * factor);
        if (this.newPick)
            stroke("blue");
        line(this.ax * factor, this.ay * factor, this.bx * factor, this.by * factor);
    }
    checkA(others) {
        let available = true;
        for (var other of others) {
            if (other != this && other.intersects(this.ax, this.ay)) {
                available = false;
            }
        }
        if (available) {
            return new Toothpick(this.ax, this.ay, -this.dir);
        } else {
            return null;
        }
    }
    checkB(others) {
        let available = true;
        for (var other of others) {
            if (other != this && other.intersects(this.bx, this.by)) {
                available = false;
            }
        }
        if (available) {
            return new Toothpick(this.bx, this.by, -this.dir);
        } else {
            return null;
        }
    }
    intersects(x, y) {
        if (this.ax == x && this.ay == y) {
            return true;
        } else if (this.bx == x && this.by == y) {
            return true;
        } else if (this.x == x && this.y == y) {
            return true;
        } else {
            return false;
        }
    }
}