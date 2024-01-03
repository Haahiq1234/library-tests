class AnimationHandler {
    static add() {

    }
    static animators = [];
    constructor(data, frames, onupdate, onend) {
        this.data = data;
        this.duration = frames;
        this.animationEndCallback = onend;
        this.animationUpdateCallback = onupdate;
        this.hasEnded = false;

    }
    get isRunning() {
        return !this.hasEnded;
    }

    endFunctions = [];
    run() {
        this.startFrame = Sketch.FRAME_NO;
        AnimationHandler.animators.push(this);
        if (this.onstart && typeof (this.onstart) == 'function') {
            this.onstart();
        }
    }
    cancel() {
        if (this.hasEnded) return;
        this.end();
    }
    ended() {
        if (this.hasEnded) {
            return true;
        }
        if (Sketch.FRAME_NO > this.startFrame + this.duration) {
            this.end();
            return true;
        }
        this.draw();
        return false;
    }
    linkEndFunction(func) {
        this.endFunctions.push(func);
    }
    end() {
        this.hasEnded = true;
        this.animationEndCallback(min(this.t(), 1));
        for (let func of this.endFunctions) {
            this.f = func;
            this.f();
        }
    }
    draw() {
        this.animationUpdateCallback(this.t());
    }
    t() {
        return (Sketch.FRAME_NO - this.startFrame) / this.duration;
    }
    addStart(func) {
        if (typeof (func) != "function") return;
        this.onstart = func;
    }
}
on.draw.bind(function () {
    for (var i = 0; i < AnimationHandler.animators.length; i++) {
        if (AnimationHandler.animators[i].ended()) {
            AnimationHandler.animators.splice(i, 1);
            i--;
        }
    }
});
function animate(...args) {
    return new AnimationHandler(...args);
}