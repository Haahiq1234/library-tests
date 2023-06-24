class Animator {
    static add() {

    }
    static animators = [];
    constructor(data, frames, onend, onupdate) {
        this.data = data;
        this.duration = frames;
        this.startFrame = Control.FRAME_NO;
        this.onend = onend;
        this.onupdate = onupdate;

        Animator.animators.push(this);
    }
    ended() {
        //console.log(Control.FRAME_NO, this.startFrame, this.duration);
        if (Control.FRAME_NO > this.startFrame + this.duration) {
            this.onend();
            return true;
        }
        this.onupdate(this.t());
        return false;
    }
    t() {
        return (Control.FRAME_NO - this.startFrame) / this.duration;
    }
}
on.update.bind(function () {
    for (var i = 0; i < Animator.animators.length; i++) {
        if (Animator.animators[i].ended()) {
            Animator.animators.splice(i, 1);
            i--;
        }
    }
});