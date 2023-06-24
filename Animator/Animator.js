class Animator {
    constructor(data, frames) {
        this.data = data;
        this.duration = frames;

        this.startFrame = Control.FRAME_NO;
        on.draw.bind(() => this.update());
        this.onend = new EventHandler();
    }
    update() {
        if (Control.FRAME_NO > this.startFrame + this.duration) {
            this.onend.Fire();
        }
    }
    t() {
        return (Control.FRAME_NO - this.startFrame) / this.duration;
    }
}