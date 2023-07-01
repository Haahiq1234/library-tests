class Grid extends Array2D {
    static Instance;
    constructor(w, h) {
        super(w, h);
        Grid.Instance = this;
        var grid = this;
        on.start.bind(() => grid.start());
    }
    start() {

    }
}