function getLineEq(x1, y1, x2, y2) {
    let a = y1 - y2;
    let b = x2 - x1;
    let c = x1 * y2 - y1 * x2;

    return [a, b, c];
}


function lineFromEq(a, b, c) {
    if (b == 0) {
        line(-c / a, 0, -c / a, CanvasHeight);
        return;
    }
    if (Math.abs(a / b) > 1) {
        line(-c / a, 0, -(b * CanvasHeight + c) / a, CanvasHeight);
    } else {
        line(0, -c / b, CanvasWidth, -(a * CanvasWidth + c) / b);
    }
}

function slope(ax, ay, bx, by) {
    return (by - ay) / (bx - ax);
}