export default class BoosterBomb {
    constructor(data) {
        this.scene = data.scene;
        this.controller = data.controller;
        this.tilesRadius = data.tilesRadius;
        this.countText = null;
    }

    start(data) {
        let array = this.getTilesInRadius(data.positionId);
        for (const id in array) {
            this.scene.tiles.checkedTiles.push(array[id]);
        }
        this.scene.tiles.DestroyPairs();
        this.controller.boosterBombCount--;
        this.countText.setText(this.controller.boosterBombCount);
    }

    getTilesInRadius(id) {
        let array = [];
        //добавляем центральную строку, потом верх и низ
        array = [
            ...this.getTilesInRow(id),
            ...this.getVerticalRows(id, true),
            ...this.getVerticalRows(id, false)
        ];
        return array;
    }

    //Добавляем все строки по вертикальному направлению
    getVerticalRows(center, isUp) {
        let rowsArray = [],
            currentId = center;
        for (let i = 0; i < this.tilesRadius; i++) {
            currentId = isUp ?
                currentId - this.scene.fieldSizeHorizontal :
                currentId + this.scene.fieldSizeHorizontal;
            let nexTile = this.scene.tiles.GetTileById(currentId);
            if (!nexTile) {
                break;
            }
            rowsArray = [...this.getTilesInRow(currentId)];
        }

        return rowsArray;
    }

    //от нажатого тайла идем влево, потом вправо и добавляем все тайлы на строке по кол-ву от радиуса взрыва
    getTilesInRow(centerId) {
        let line = [],
            currentId = centerId,
            centerTile = this.scene.tiles.GetTileById(centerId);
        line.push(centerTile);
        for (let i = 0; i < this.tilesRadius; i++) {
            currentId--;
            let nexTile = this.scene.tiles.GetTileById(currentId);
            if (!nexTile || nexTile.row !== centerTile.row) {
                break;
            }
            line.push(nexTile);
        }
        currentId = centerId;
        for (let i = 0; i < this.tilesRadius; i++) {
            currentId++;
            let nexTile = this.scene.tiles.GetTileById(currentId);
            if (!nexTile || nexTile.row !== centerTile.row) {
                break;
            }
            line.push(nexTile);
        }
        return line;
    }
}