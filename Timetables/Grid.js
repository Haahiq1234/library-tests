
class Grid extends Array2D {
    constructor(classes, teachers) {
        super(8 * 4 + 3, classes.length);
        this.classes = classes;
        this.teachers = teachers;
    }
}