class Animator {
    static add() {

    }
    static animators = [];
    constructor(data, frames, onupdate, onend) {
        this.data = data;
        this.duration = frames;
        this.startFrame = Control.FRAME_NO;
        this.onend = onend;
        this.onupdate = onupdate;
        this.isCancelled = false;

        Animator.animators.push(this);
    }
    cancel() {
        this.isCancelled = true;
        this.onend();
    }
    ended() {
        if (this.isCancelled) {
            return true;
        }
        if (Control.FRAME_NO > this.startFrame + this.duration) {
            this.onend();
            return true;
        }
        this.draw();
        return false;
    }
    draw() {
        this.onupdate(this.t());
    }
    t() {
        return (Control.FRAME_NO - this.startFrame) / this.duration;
    }
}
on.draw.bind(function () {
    for (var i = 0; i < Animator.animators.length; i++) {
        if (Animator.animators[i].ended()) {
            Animator.animators.splice(i, 1);
            i--;
        }
    }
});
function animate(...args) {
    return new Animator(...args);
}