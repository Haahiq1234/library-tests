class Camera {
    static Instance;
    constructor() {
        Camera.Instance = this;
        var camera = this;
        on.start.bind(() => camera.start());
    }
    start() {

    }
}