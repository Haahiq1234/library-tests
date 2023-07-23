class Animator {
    static add() {

    }
    static animators = [];
    constructor(data, frames, onupdate, onend) {
        this.data = data;
        this.duration = frames;
        this.startFrame = Control.FRAME_NO;
        this.animationEndCallback = onend;
        this.animationUpdateCallback = onupdate;
        this.isCancelled = false;
        this.hasEnded = false;

        Animator.animators.push(this);
    }
    cancel() {
        if (this.hasEnded || this.isCancelled) return;
        this.isCancelled = true;
        this.end();
    }
    ended() {
        if (this.isCancelled) {
            return true;
        }
        if (Control.FRAME_NO > this.startFrame + this.duration) {
            this.hasEnded = true;
            this.end();
            return true;
        }
        this.draw();
        return false;
    }
    end() {
        this.animationEndCallback(min(this.t(), 1));
    }
    draw() {
        this.animationUpdateCallback(this.t());
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