/// <reference path='..\Canvas.js' />

{
  const scenario_id = 1;
  let circle_A;
  let circle_B;
  let line_A;
  let line_B;

  scenario_loaders[scenario_id] = function () {
    if (!scenarios_loaded[scenario_id]) {
      circle_A = new Gizmo(2, 0);
      circle_B = new Gizmo(0, 2);
      line_A = new Gizmo(-2, 0);
      line_B = new Gizmo(0, -3);
      scenarios_loaded[scenario_id] = true;
    } else {
      circle_A.Enable();
      circle_B.Enable();
      line_A.Enable();
      line_B.Enable();
    }
  };
  scenario_unloaders[scenario_id] = function () {
    if (!scenarios_loaded[scenario_id]) return;
    circle_A.Disable();
    circle_B.Disable();
    line_A.Disable();
    line_B.Disable();
  };

  on.draw.bind(() => {
    if (scenario != scenario_id || !scenarios_loaded[scenario_id]) return;
    const [a, b, c] = getLineEq(line_A.x, line_A.y, line_B.x, line_B.y);
    lineFromEq(a, b, c);

    let cs = getCirclesFromScenario1(
      circle_A.x,
      circle_A.y,
      circle_B.x,
      circle_B.y,
      a,
      b,
      c,
    );
    for (let i = 0; i < cs.length; i++) {
      //circle(cs[i][0], cs[i][1], cs[i][2]);
    }
  });
  function getCirclesFromScenario1(x1, y1, x2, y2, a, b, c) {
    let a1 = 2 * (x2 - x1);
    let b1 = 2 * (y2 - y1);
    let c1 = x1 * x1 - x2 * x2 + y1 * y1 - y2 * y2;
    lineFromEq(a1, b1, c1);

    if (a1 == 0) {
      console.log("Shut ur ass up");
    }
    let a2 = -b1 / a1;
    let b2 = -c1 / a1;

    let a3 = a2 * a2 + 1;
    let b3 = 2 * (a2 * b2 - x1 * a1 - y1);
    let c3 = b2 * b2 - 2 * x1 * b2 + x1 * x1 + y1 * y1;
    let d3 = a * a2 + b;
    let e3 = a * b2 + c;
    let f3 = a * a + b * b;

    let a4 = f3 * a3 - d3 * d3;
    let b4 = f3 * b3 - 2 * d3 * e3;
    let c4 = f3 * c3 - e3 * e3;

    //lineFromEq(a4, b4, c4);

    let ks = QuadraticFormula(a4, b4, c4);
    let circles = [];
    for (let i = 0; i < ks.length; i++) {
      let k = ks[i];
      line(0, k, CanvasWidth, k);
      let h = a2 * k + b2;
      let r = Math.sqrt((h - x1) ** 2 + (k - x1) ** 2);
      circles.push([h, k, r]);
    }
    return circles;
  }
}
