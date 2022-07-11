import {config} from '../index';
import Tile from '../prefabs/Tile.js';
import Puff from '../prefabs/Puff.js';

export default class ShakeModel {
    constructor(data) {
        this.init(data);
    }

    init({scene, view, tiles, shakeCount}) {
        this.scene = scene;
        this.view = view;
        this.tiles = tiles;
        this.shakeCount = shakeCount;
        this.view.setText(this.shakeCount);
    }

    checkTiles() {
        //Проверяем парные тайлы
        for (const tile of this.tiles.children.entries) {
            this.tiles.CheckPair(tile);
            //Если есть комбинация, то остановить проверку
            if (this.tiles.checkedTiles.length >= config.minBlockToDestroy) {
                this.tiles.checkedTiles.length = 0;
                this.resetCheckMarks();
                return;
            }
            this.tiles.checkedTiles.length = 0;
            this.resetCheckMarks();
        }
        this.doShake();
    }

    resetCheckMarks() {
        for (const tile of this.tiles.children.entries) {
            tile.checked = false;
        }
    }

    doShake() {
        if (this.isShakesCountEnd()) {
            return;
        }
        for (const tile of this.tiles.children.entries) {
            let newParams = Tile.generateAttributes();
            tile.reset({
                x: tile.x,
                y: tile.y,
                frame: newParams.frame,
                colorNum: newParams.colorNum
            });
            new Puff({
                scene: tile.scene,
                x: tile.x,
                y: tile.y
            });
        }
        this.shakeCount--;
        this.view.setText(this.shakeCount);
        this.scene.time.addEvent({
            delay: 2000,
            loop: false,
            callback: () => {
                this.scene.events.emit('shake');
            },
            callbackScope: this
        });
    }

    isShakesCountEnd() {
        if (this.shakeCount <= 0) {
            this.scene.menuMessage = "Shakes is over =(";
            this.scene.events.emit('endGame');
            return true;
        }
        return false;
    }
}