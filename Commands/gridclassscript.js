class upperName extends Array2D {
    static Instance;
    constructor(w, h) {
        super(w, h);
        upperName.Instance = this;
        var lowerName = this;
        on.start.bind(() => lowerName.start());
    }
    start() {

    }
}