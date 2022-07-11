import {config} from '../index';

export default class BonusPanel extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, 'bonus_panel');
        this.init(data);
    }

    init(data) {
        this.scene.add.existing(this).setScale(config.width * config.imagesScale);
        this.x += this.displayWidth / 2;
        this.applyCount = data.applyCount;
        this.image = this.scene.add.image(this.x, this.y - (this.displayHeight * 0.15), data.bonusImage)
            .setScale(config.width * config.imagesScale);
        data.model.countText = this.scene.add.text(this.x, this.y + (this.displayHeight * 0.25), this.applyCount, {
            font: '100px CurseCasual',
            fill: '#ffffff'
        }).setOrigin(0.5).setScale(config.width * config.imagesScale);
        if (data.isActiveSkill)
            this.setInteractive().on('pointerdown', () => {
                this.scene.bonusesController.onButtonClick({
                    button: this,
                    buttonName: data.buttonName,
                });
            });
    }
}