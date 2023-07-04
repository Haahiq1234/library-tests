class SlideEvent {
    static events = [];
    static pressedPosition = new Vector2(0, 0);

    ready = false;
    constructor(f, l, oneTime) {
        this.length = l;
        this.function = f;
        this.oneTime = oneTime;
        SlideEvent.events.push(this);
    }
    Fire(dx, dy) {
        if (this.oneTime) {
            this.ready = false;
        }
        this.function(SlideEvent.pressedPosition.x, SlideEvent.pressedPosition.y, dx, dy);
        SlideEvent.pressedPosition.set(dx, dy);
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
    }
});