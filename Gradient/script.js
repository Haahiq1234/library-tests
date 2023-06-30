function setUp() {
    createCanvas(150, 150);
    frameRate(60);
    var radgrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 150);
    radgrad.addColorStop(0, '#A7D30C');
    radgrad.addColorStop(1, 'rgba(0, 0, 0,0.25)');

    var radgrad2 = ctx.createRadialGradient(0, 150, 1, 0, 150, 150);
    radgrad2.addColorStop(0, '#FF5F98');
    radgrad2.addColorStop(1, 'rgba(255, 255, 0,0.25)');

    var radgrad3 = ctx.createRadialGradient(150, 0, 1, 150, 0, 150);
    radgrad3.addColorStop(0, '#00C9FF');
    radgrad3.addColorStop(1, 'rgba(0,201,255,0.25)');

    var radgrad4 = ctx.createRadialGradient(150, 150, 1, 150, 150, 150);
    radgrad4.addColorStop(0, '#F4F201');
    radgrad4.addColorStop(1, 'rgba(0,255,255,0.25)');

    ctx.fillStyle = radgrad4;
    ctx.fillRect(0, 0, 150, 150);
    ctx.fillStyle = radgrad3;
    ctx.fillRect(0, 0, 150, 150);
    ctx.fillStyle = radgrad2;
    ctx.fillRect(0, 0, 150, 150);
    ctx.fillStyle = radgrad;
    ctx.fillRect(0, 0, 150, 150);
}
function draw() {
    //clear();
}