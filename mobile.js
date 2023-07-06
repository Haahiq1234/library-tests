const SLIDE_DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
}


class SlideEvent {
    static events = [];
    static pressedPosition = new Vector2(0, 0);

	previous = -1;
    ready = false;
    constructor(f, l, oneTime) {
        this.length = l;
        this.function = f;
        this.oneTime = oneTime;
        SlideEvent.events.push(this);
    }
    Fire(x, y) {
		let ax = SlideEvent.pressedPosition.x;
		let ay = SlideEvent.pressedPosition.y;
		let bx = x;
		let by = y;
        if (this.oneTime) {
            this.ready = false;
        }
		let dir = -1;
        let dx = bx - ax;
        let dy = by - ay;
        if (abs(dx) > abs(dy)) {
            if (dx > 0) {
				dir = SLIDE_DIRECTION.RIGHT;
            } else {
				dir = SLIDE_DIRECTION.LEFT;
            }
        } else {
            if (dy > 0) {
				dir = SLIDE_DIRECTION.DOWN;
            } else {
				dir = SLIDE_DIRECTION.UP;
            }
        }
		if (dir == this.previous) return;
		this.previous = dir;
        this.function(dir, ax, ay, bx, by);
        SlideEvent.pressedPosition.set(x, y);
    }
}
function addSlideEvent(funct, length, oneTime) {
    new SlideEvent(funct, length, oneTime);
}
on.pointerdown.bind(function (x, y) {
    SlideEvent.pressedPosition = new Vector2(x, y);
    for (var event of SlideEvent.events) {
        event.ready = true;
    }
});
on.pointermove.bind(function (x, y) {
    if (mousePressed) {
        let mp = new Vector2(x, y);
        for (var event of SlideEvent.events) {
            let p = Vector.sub(mp, SlideEvent.pressedPosition);
            let m = p.mag();
            if (m >= event.length && event.ready) {
                event.Fire(mp.x, mp.y);
            }
        }
    }
});
on.pointerup.bind(function (x, y) {
    for (var event of SlideEvent.events) {
        event.ready = false;
		event.previous = -1;
    }
});