
class Rect {
    constructor(x, y, w, h) {
        this.x = x + ((w < 0)? w : 0);
        this.y = y + ((h < 0)? h : 0);
        this.w = Math.abs(w);
        this.h = Math.abs(h);
    }
    contains(px, py) {
        return (px > this.x && py > this.y && px < this.x + this.w && py < this.y + this.h);
    }
    intersectsRect(rect) {
        return (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.h);
    }
}