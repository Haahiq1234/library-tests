function loadCircuitCodingTrainTileSet() {
    let tiles = [];

    // Purple: A
    // Pink: B
    // Blue: C
    // Black: D
    // Dark Purple: E


    tiles.push(new Tile(0, 0, ["EEE", "EEE", "EEE", "EEE"]));
    tiles.push(new Tile(3, 1, ["EAA", "ABA", "AAE", "EEE"]));
    tiles.push(tiles[1].rotate());
    tiles.push(tiles[2].rotate());
    tiles.push(tiles[3].rotate());
    tiles.push(new Tile(0, 2, ["EAA", "AAA", "AAA", "AAE"]));
    tiles.push(tiles[5].rotate());
    tiles.push(tiles[6].rotate());
    tiles.push(tiles[7].rotate());
    tiles.push(new Tile(1, 0, ["AAA", "AAA", "AAA", "AAA"]));
    tiles.push(new Tile(2, 0, ["ABA", "ABA", "ABA", "ABA"]));
    tiles.push(tiles[10].rotate());
    tiles.push(new Tile(3, 0, ["ABA", "ABA", "AAA", "AAA"]));
    tiles.push(tiles[12].rotate());
    tiles.push(tiles[13].rotate());
    tiles.push(tiles[14].rotate());
    tiles.push(new Tile(0, 1, ["AAA", "ABA", "AAA", "ABA"]));
    tiles.push(tiles[16].rotate());
    tiles.push(new Tile(1, 1, ["AAA", "ABA", "AAA", "AAA"]));
    tiles.push(tiles[18].rotate());
    tiles.push(tiles[19].rotate());
    tiles.push(tiles[20].rotate());
    tiles.push(new Tile(2, 1, ["AAA", "ACA", "AAA", "ACA"]));
    tiles.push(tiles[22].rotate());
    tiles.push(new Tile(1, 2, ["AAA", "ABA", "AAA", "ABA"]));
    tiles.push(tiles[24].rotate());
    tiles.push(new Tile(2, 2, ["ACA", "ABA", "ACA", "ABA"]));
    tiles.push(tiles[26].rotate());
    tiles.push(new Tile(3, 2, ["ACA", "AAA", "ABA", "AAA"]));
    tiles.push(tiles[28].rotate());
    tiles.push(tiles[29].rotate());
    tiles.push(tiles[30].rotate());
    tiles.push(new Tile(0, 3, ["ABA", "ABA", "AAA", "ABA"]));
    tiles.push(tiles[32].rotate());
    tiles.push(tiles[33].rotate());
    tiles.push(tiles[34].rotate());

    return [tiles, loadImage("tiles/circuit/atlas.png"), 56, 56, tiles.length];
}

function loadPolkaTileSet() {
    let tiles = [];

    const T = "T";
    const F = "F";
    tiles.push(new Tile(0, 0, [F, F, F, F]));
    tiles.push(new Tile(1, 0, [F, T, T, T]));
    tiles.push(tiles[1].rotate());
    tiles.push(tiles[2].rotate());
    tiles.push(tiles[3].rotate());

    return [tiles, loadImage("tiles/train-tracks/atlas.png"), 600, 600, tiles.length];
}