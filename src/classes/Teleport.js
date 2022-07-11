
export default class Teleport {
    constructor(data) {
        this.scene = data.scene;
        this.firstTile = null;
        this.controller = data.controller;
        this.countText = null;
        this.scene.events.on('deactivateBonus', () => {
            this.deactivate();
        }, this);
    }

    start(tile) {
        if (this.firstTile) {
            this.activateTeleportation(tile);
            this.scene.bonusesController.deactivateBonus();
        } else {
            this.firstTile = tile;
            this.addTileFrame(tile);
        }
    }

    activateTeleportation(secondTile) {
        let tempTile = {
            colorNum: secondTile.colorNum,
            frame: secondTile.frame,
            velocity: secondTile.velocity,
            points: secondTile.points
        }
        secondTile.colorNum = this.firstTile.colorNum;
        secondTile.velocity = this.firstTile.velocity;
        secondTile.points = this.firstTile.points;
        secondTile.setFrame(this.firstTile.frame.name);

        this.firstTile.colorNum = tempTile.colorNum;
        this.firstTile.velocity = tempTile.velocity;
        this.firstTile.points = tempTile.points;
        this.firstTile.setFrame(tempTile.frame.name);

        this.controller.teleportCount--;
        this.countText.setText(this.controller.teleportCount);
    }

    addTileFrame(tile) {
        this.firstTileFrame = this.scene.add.graphics()
            .lineStyle(2, 0xffff00, 1)
            .strokeRoundedRect(
                tile.x - (tile.displayWidth / 2),
                tile.y - (tile.displayHeight / 2),
                tile.displayWidth,
                tile.displayHeight);
    }

    deactivate() {
        if(this.firstTileFrame)
            this.firstTileFrame.destroy();
        this.firstTile = null;
    }
}