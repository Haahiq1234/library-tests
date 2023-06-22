class upperName {
    static Instance;
    constructor() {
        upperName.Instance = this;
        var lowerName = this;
        on.start.bind(() => lowerName.start());
    }
    start() {

    }
}