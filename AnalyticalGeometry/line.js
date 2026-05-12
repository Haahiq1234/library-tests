function getLineEq(x1, y1, x2, y2) {
    let a = y1 - y2;
    let b = x2 - x1;
    let c = x1 * y2 - y1 * x2;

    return [a, b, c];
}

function lineFromEq(a, b, c) {
    if (b == 0) {
        line(-c / a, -max_x, -c / a, max_x);
        return;
    }
    if (Math.abs(a / b) > 1) {
        line(-(-b * max_x + c) / a, -max_x, -(b * max_x + c) / a, max_x);
    } else {
        line(-max_x, -(-a * max_x + c) / b, max_x, -(a * max_x + c) / b);
    }
}

function slope(ax, ay, bx, by) {
    return (by - ay) / (bx - ax);
}
