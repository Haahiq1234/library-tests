function loadPipeTileSet() {
    let tiles = [];
    let T = 'T';
    let F = "F";

    tiles.push(new Tile(0, 0, [T, F, T, F]));
    tiles.push(tiles[0].rotate(1));
    tiles.push(new Tile(2, 0, [T, T, T, T]));
    tiles.push(new Tile(3, 0, [F, F, F, F]));

    tiles.push(new Tile(0, 1, [T, T, F, F]));
    tiles.push(tiles[4].rotate());
    tiles.push(tiles[5].rotate());
    tiles.push(tiles[6].rotate());

    tiles.push(new Tile(0, 2, [T, F, T, T]));
    tiles.push(tiles[8].rotate());
    tiles.push(tiles[9].rotate());
    tiles.push(tiles[10].rotate());

    tiles.push(new Tile(0, 3, [T, F, F, F]));
    tiles.push(tiles[12].rotate());
    tiles.push(tiles[13].rotate());
    tiles.push(tiles[14].rotate());

    return [tiles, loadImage("atlas.png", 400, 400), 100, 100, 16];
}