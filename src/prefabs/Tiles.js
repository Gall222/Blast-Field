import Puff from '../prefabs/Puff.js';
import Tile from '../prefabs/Tile.js';
import {config} from '../index';

export default class Tiles extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.init();
    }

    init() {
        this.clickStopperTimer = null;
        this.checkedTiles = [];
        this.initTilesPositions();
        this.CreateBlocks();
    }

    initTilesPositions() {
        let positions = [];
        let offsetX = (this.scene.sys.game.config.width - this.scene.blockSize * this.scene.fieldSizeHorizontal) / 2 + (this.scene.blockSize / 2);
        let offsetY = (this.scene.scoreMenu.scorePanel.y + this.scene.scoreMenu.scorePanel.displayHeight / 2) + (this.scene.blockSize);
        let id = 0;
        for (let row = 0; row < this.scene.fieldSizeVertical; row++) {
            for (let col = 0; col < this.scene.fieldSizeHorizontal; col++) {
                positions.push({
                    x: offsetX + col * this.scene.blockSize,
                    y: offsetY + row * this.scene.blockSize,
                    positionId: id,
                    row: row
                });
                id++;
            }
        }
        this.positions = positions;
    }

    CreateBlocks() {
        for (let val of this.positions) {
            let attribute = Tile.generateAttributes();
            let newTile = new Tile({
                scene: this.scene,
                x: val.x,
                y: val.y,
                texture: "blocks",
                frame: attribute.frame,
                blockSize: this.scene.blockSize,
                positionId: val.positionId,
                colorNum: attribute.colorNum,
                velocity: attribute.velocity,
                row: val.row,
                points: attribute.points,
            });
            this.add(newTile);
            this.setEvents(newTile);
        }
    }

    setEvents(tile) {
        tile.setInteractive().on('pointerdown', () => {
            if (!this.scene.isGameAlive || !this.scene.isClickAble) {
                return;
            }
            if (this.scene.activeBonus) {
                this.scene.activeBonus.call(this.scene.bonusesController, tile);
            } else {
                //ищем совпадения по цвету (цвета - цифры)
                this.CheckPair(tile);
                if (this.checkedTiles.length >= config.minBlocksToUltimateTile) {
                    this.scene.bonusesController.ultimateTile.createUltimateTile(tile);
                }
                this.DestroyPairs();

            }
        });
    }

    CheckPair(tile) {
        //получаем соседние примыкающие тайлы
        let neighbours = this.FindNeighbours(tile);
        //ставим метку checked
        tile.checked = true;
        this.checkedTiles.push(tile);
        for (const key in neighbours) {
            //если сосед есть и его цвет совпадает с нажатым + нет метки checked
            if ((neighbours[key] && neighbours[key].colorNum === tile.colorNum) && !neighbours[key].checked) {
                //запускаем метод для совпавшего рекурсией
                this.CheckPair(neighbours[key]);
            }
        }
    }

    FindNeighbours(tile) {
        let right = this.GetTileById(tile.positionId + 1),
            left = this.GetTileById(tile.positionId - 1);
        return {
            top: this.GetTileById(tile.positionId - this.scene.fieldSizeHorizontal),
            right: right && right.row === tile.row ? right : null,
            left: left && left.row === tile.row ? left : null,
            bottom: this.GetTileById(tile.positionId + this.scene.fieldSizeHorizontal)
        };
    }

    DestroyPairs() {
        if (this.checkedTiles.length >= config.minBlockToDestroy) {
            for (const tile of this.checkedTiles) {
                tile.checked = false;
                tile.setAlive(false);
                Puff.generate(this.scene, tile.x, tile.y);
                this.OnTileDestroy(tile);
                this.FindTopTiles(tile);
            }
            this.OnTileTap();
        }
        this.checkedTiles.length = 0;
    }

    FindTopTiles(tile) {
        let topTile = this.GetTileById(tile.positionId - this.scene.fieldSizeHorizontal);
        if (topTile) {
            let newPosition = this.positions[tile.positionId];

            if (this.hasOwnProperty('movingTween')) {
                topTile.movingTween.updateTo('x', newPosition.x, true);
                topTile.movingTween.updateTo('y', newPosition.y, true);
            } else {
                topTile.movingTween = topTile.MoveTile({
                    x: newPosition.x,
                    y: newPosition.y,
                    velocity: topTile.velocity
                });
            }
            this.FindTopTiles(topTile);
            topTile.positionId = newPosition.positionId;
            topTile.row = newPosition.row;
        } else {
            this.CreateNewTile(tile);
        }
    }

    GetTileById(id) {
        for (const tile of this.children.entries) {
            if (tile.positionId === id) {
                return tile;
            }
        }
        return null;
    }

    CreateNewTile(bottomTile) {
        let newTile = this.getFirstDead();
        let params = Tile.generateAttributes();
        let newPosition = this.positions[bottomTile.positionId];
        newTile.reset({
            x: bottomTile.x,
            y: bottomTile.y - newTile.displayHeight,
            frame: params.frame,
            colorNum: params.colorNum
        });
        newTile.MoveTile({
            x: newPosition.x,
            y: newPosition.y,
            velocity: params.velocity
        });
        newTile.positionId = newPosition.positionId;
        newTile.row = newPosition.row;
        newTile.points = params.points;
    }

    OnTileTap() {
        this.scene.scoreMenu.DoStep();
    }

    OnTileDestroy(tile) {
        this.scene.scoreMenu.AddScore(tile.points);
        this.ClickStopper();
    }

    ClickStopper() {
        if (this.clickStopperTimer) {
            return;
        }
        this.scene.isClickAble = false;
        this.clickStopperTimer = this.scene.time.addEvent({
            delay: 1000,
            loop: false,
            callback: () => {
                this.scene.isClickAble = true;
                this.clickStopperTimer = null;
                this.scene.events.emit('shake');
            },
            callbackScope: this
        });
    }
}