/// <reference path='..\Canvas.js' />

{
  const scenario_id = 0;
  let pointA;
  let pointB;
  let pointC;

  scenario_loaders[scenario_id] = () => {
    if (!scenarios_loaded[scenario_id]) {
      pointA = new Gizmo(2, 0);
      pointB = new Gizmo(0, 0);
      pointC = new Gizmo(0, 3);
      scenarios_loaded[scenario_id] = true;
    } else {
      pointA.Enable();
      pointB.Enable();
      pointC.Enable();
    }
  };
  scenario_unloaders[scenario_id] = () => {
    if (!scenarios_loaded[scenario_id]) return;
    pointA.Disable();
    pointB.Disable();
    pointC.Disable();
  };

  on.draw.bind(() => {
    if (!scenarios_loaded[scenario_id] || scenario != scenario_id) return;
    let c = three_points_to_circle(
      pointA.x,
      pointA.y,
      pointB.x,
      pointB.y,
      pointC.x,
      pointC.y,
    );
    circle(c[0], c[1], c[2]);
  });

  function three_points_to_circle(a, b, c, d, e, f) {
    line(a, b, c, d);
    line(c, d, e, f);
    line(a, b, e, f);

    let a1 = 2 * (c - a);
    let b1 = 2 * (d - b);
    let c1 = a * a + b * b - c * c - d * d;

    let a2 = 2 * (c - e);
    let b2 = 2 * (d - f);
    let c2 = e * e + f * f - c * c - d * d;

    let den = a2 * b1 - a1 * b2;
    if (den == 0) {
      console.log("Points are collinear");
      return [0, 0, 0];
    }
    let h = (c1 * b2 - c2 * b1) / den;
    let k = (a1 * c2 - a2 * c1) / den;

    //circle(c, d, 1);

    return [h, k, dist(h, k, a, b)];
  }
}
