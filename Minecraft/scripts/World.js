class World {
    static Instance;
    constructor() {
        World.Instance = this;
        var world = this;
        on.start.bind(() => world.start());
    }
    start() {

    }
}