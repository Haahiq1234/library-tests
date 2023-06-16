const width = 25;
const northWest = new Vector2(90, 50);
const northEast = new Vector2(210, 50);

const southWest = new Vector2(90, 250);
const southEast = new Vector2(210, 250);

const midy = (southEast.y + northEast.y - width) / 2;
const westmid = (midy + (southWest.y - northWest.y + width) / 4);
const eastmid = (midy - (southWest.y - northWest.y - width * 3) / 4);

function setUp() {
    createCanvas(300, 300);
    frameRate(60);
}
function draw() {
    clear();
    fill(0, 255, 0);
    noStroke();
    rect(northWest.x, northWest.y, width, southWest.y - northWest.y);
    rect(northEast.x - width, northEast.y, width, southEast.y - northEast.y);
    rect(northWest.x + width, midy, northEast.x - northWest.x - width * 2, width);


    //ellipse(southWest.x, westmid, width, westmid - midy, 90, 270);
    circle(southWest.x, westmid, westmid - midy, 90, 270);
    //ellipse(northEast.x, eastmid, width, westmid - midy, -90, 90);
    circle(northEast.x, eastmid, westmid - midy, -90, 90);

    fill(255);
    circle(southWest.x, westmid, westmid - midy - width, 90, 270);
    circle(northEast.x, eastmid, westmid - midy - width, -90, 90);
}