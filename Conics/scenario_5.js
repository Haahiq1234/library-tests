/// <reference path='..\Canvas.js' />
/// <reference path='..\Scenario.js' />

// Getting two points and a tangent to the circle at the second point
//
{
    const scenario_id = next_scenario();
    let pointA;
    let pointB;
    let pointC;

    scenario_inits[scenario_id] = () => {
        pointA = new Gizmo(2.5, 2.5);
        pointB = new Gizmo(-3, -3);
        pointC = new Gizmo(4, -3);
    };

    scenario_loaders[scenario_id] = () => {
        pointA.Enable();
        pointB.Enable();
        pointC.Enable();
    };
    scenario_unloaders[scenario_id] = () => {
        pointA.Disable();
        pointB.Disable();
        pointC.Disable();
    };

    scenario_draws[scenario_id] = () => {
        fill_triangle(
            pointA.x,
            pointA.y,
            pointB.x,
            pointB.y,
            pointC.x,
            pointC.y,
            0.2,
            //scale_x(4),
        );
    };
    function in_between(a, b, x) {
        if (b > a) return x > a && x < b;
        return x < a && x > b;
    }
    function triangle_xs(a, b, c, d, e, f, y) {
        let xs = [];
        if (y == b) xs.push(a);
        if (y == f) xs.push(e);
        if (y == d) xs.push(c);
        if (in_between(b, d, y)) xs.push(((y - b) * (c - a)) / (d - b) + a);
        if (in_between(d, f, y)) xs.push(((y - d) * (e - c)) / (f - d) + c);
        if (in_between(b, f, y)) xs.push(((y - b) * (e - a)) / (f - b) + a);

        return xs;
    }
    function triangle_f(x, y) {
        fill(
            normalize(x, -max_x, max_x) * 255,
            normalize(y, -max_x, max_x) * 255,
            0,
        );
    }
    function fill_triangle(a, b, c, d, e, f, res) {
        let min_y = min(b, d, f) - res;
        let max_y = max(b, d, f) + res;
        //let min_x = min(a, c, e);
        //let max_x = max(a, c, e);
        //rect(min_x, min_y, max_x - min_x, max_y - min_y);
        noStroke();
        for (let y = floor(min_y, res); y < max_y; y += res) {
            // let cast = Raycast.shape(min_x - 5, y, 1, 0, a, b, c, d, e, f);
            // let arr = cast.points;
            // if (cast.hit) {
            //     if (cast.points.length == 1) {
            //         circle(cast.point.x, cast.point.y, 0.05);
            //         continue;
            //     }
            let arr = triangle_xs(a, b, c, d, e, f, y);
            if (arr.length == 1) {
                //console.log("Huh");
                //circle(arr[0], y, 1);
                continue;
            }
            let ax = arr[0];
            let bx = ax;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < ax) ax = arr[i];
                if (arr[i] > ax) bx = arr[i];
            }
            ax -= res;
            bx += res;

            for (let x = floor(ax, res); x < bx; x += res) {
                // fill(
                //     normalize(x, min_x, max_x) * 255,
                //     normalize(y, min_y, max_y) * 255,
                //     122,
                // );
                triangle_f(x, y);
                rect(x, y, res, res);
            }
            //line(ax, y, bx, y);
            // circle(ax, y, res / 2);
            //circle(bx, y, res / 2);
            //}
        }
        nofill();
    }
}
