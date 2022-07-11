import {config} from '../index';

export default class PauseMenu extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, 'pause');
        this.init(data);
    }

    init(data) {
        this.scene.add.existing(this);
        this.setScale(config.width * config.imagesScale);
        this.x -= this.displayWidth / 2;
        this.y += this.displayHeight / 2;

        this.setInteractive().on('pointerdown', () => {
            this.scene.scene.pause();
            this.scene.scene.launch('Pause');
        });
    }
}