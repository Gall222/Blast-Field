import Tile from '../prefabs/Tile.js';

export default class UltimateTile{
    constructor(data) {
        this.scene = data.scene;
        this.controller = data.controller;
        this.bomb = null;
        this.applyCount = this.controller.ultimateCount;
        this.countText = null;
    }

    createUltimateTile(tile){
        if(this.applyCount <= 0){return}
        let tileId = tile.positionId;
        this.scene.time.addEvent({
            delay: 700,
            loop: false,
            callback: ()=>{
                let newTile = this.scene.tiles.GetTileById(tileId);
                this.createNewUltimateTile(newTile);
            },
            callbackScope: this
        });
        this.applyCount--;
        this.countText.setText(this.applyCount);
    }
    //создаем новый тайл с особыв св-вом и добавляем его на место тайла, по которому нажали
    createNewUltimateTile(tile){
        if(this.bomb){return;}
        let ultimateTile = new Tile({
            scene: this.scene,
            x: tile.x,
            y: tile.y,
            texture: "block",
            frame: "block",
            blockSize: this.scene.blockSize,
            positionId: tile.positionId,
            colorNum: null,
            velocity: tile.velocity,
            row: tile.row,
            points: tile.points,
        });
        //отключаем старый тайл
        tile.positionId = null;
        tile.setAlive(false);
        ultimateTile.setInteractive().on('pointerdown',  ()=> {
            this.destroyBomb();
            this.destroyAllTiles();
        });
        this.bomb = ultimateTile;
        this.scene.tiles.add(this.bomb, true);
    }
    destroyBomb(){
        this.createNewCommonTile();
        this.scene.tiles.remove(this.bomb);
        this.bomb.destroy();
        this.bomb = null;
    }
    //создаем обычный тайл и добавляем его в общую группы для корректной обработки
    createNewCommonTile() {
        let newTile = this.scene.tiles.getFirstDead();
        let params = Tile.generateAttributes();
        let newPosition = this.scene.tiles.positions[this.bomb.positionId];
        newTile.reset({
            x: this.bomb.x,
            y: this.bomb.y - newTile.displayHeight,
            frame: params.frame,
            colorNum: params.colorNum
        });
        newTile.positionId = newPosition.positionId;
        newTile.row = newPosition.row;
        newTile.points = params.points;
        this.scene.tiles.add(newTile, true);
    }

    destroyAllTiles(){
        for (const tile of this.scene.tiles.children.entries) {
            this.scene.tiles.checkedTiles.push(tile);
        }
        this.scene.tiles.DestroyPairs();
    }
}