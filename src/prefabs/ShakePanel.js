import {config} from '../index';

export default class ShakePanel extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, 'rounded_rectangle_large');
        this.init();
    }

    init() {
        this.scene.add.existing(this).setScale(config.width * config.imagesScale);
        this.x += this.displayWidth / 2;
        this.y += this.displayHeight / 2;
        this.countText = this.scene.add.text(this.x, this.y, 'Shakes: 0', {
            font: '100px CurseCasual',
            fill: '#ffffff'
        }).setOrigin(0.5).setScale(config.width * config.imagesScale);
    }

    setText(count) {
        this.countText.setText('Shakes: ' + count);
    }

}