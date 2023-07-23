class upperName extends Array2D {
    constructor(w, h) {
        super(w, h);
        var lowerName = this;
        on.start.bind(() => lowerName.init());
    }
    init() {

    }
}