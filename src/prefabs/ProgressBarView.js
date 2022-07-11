import {config} from '../index';

export default class ProgressBarView extends Phaser.Physics.Arcade.Group {
    constructor(data) {
        super(data.scene.physics.world, data.scene);
        this.init(data);
    }

    init(data) {
        this.createBackground(data);
        this.createBarBack();
        this.createBarFront();
    }

    createBackground(data) {
        this.backround = this.scene.add.image(data.x, data.y, 'progress_panel')
            .setScale(config.width * config.imagesScale);
        this.backround.y = this.backround.displayHeight / 2;
        this.titleText = this.scene.add.text(this.backround.x, this.backround.y - (this.backround.displayHeight * 0.25), 'Progress', {
            font: '100px CurseCasual',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setScale(config.width * config.imagesScale);
    }

    createBarBack() {
        this.progressBox = this.scene.add.image(this.backround.x, this.backround.y + (this.backround.displayHeight * 0.2), 'progress_bar_back')
            .setScale(config.width * config.imagesScale);
    }

    createBarFront() {
        this.progressBar = this.scene.add.image(this.progressBox.x - (this.progressBox.displayWidth / 2) + 2, this.progressBox.y, 'progress_bar_front')
            .setScale(config.width * config.imagesScale).setOrigin(0, 0.5);
    }
}