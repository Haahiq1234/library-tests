class SlideEvent {
    static events = [];
    static pressedPosition = new Vector2(0, 0);
    constructor(f, l) {
        this.length = l;
        this.function = f;
        SlideEvent.events.push(this);
    }
    Fire(dx, dy) {
        this.function(SlideEvent.pressedPosition.x, SlideEvent.pressedPosition.y, dx, dy);
        SlideEvent.pressedPosition.set(dx, dy);
    }
}
function addSlideEvent(funct, length) {
    new SlideEvent(funct, length);
}
on.pointerdown.bind(function (x, y) {
    SlideEvent.pressedPosition = new Vector2(x, y);
});
on.pointermove.bind(function (x, y) {
    if (mousePressed) {
        let mp = new Vector2(x, y);
        for (var event of SlideEvent.events) {
            let p = Vector.sub(mp, SlideEvent.pressedPosition);
            let m = p.mag();
            if (m >= event.length) {
                event.Fire(mp.x, mp.y);
            }
        }
    }
});