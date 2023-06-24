class Player {
    static Instance;
    constructor() {
        Player.Instance = this;
        on.start.bind(() => this.start());
        this.x = 20;
        this.y = 20;
        this.width = 40;
        this.height = 40;
    }
    start() {

    }
}