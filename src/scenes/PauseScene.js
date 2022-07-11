import Phaser from 'phaser';
import {config} from '../index';

export default class PauseScene extends Phaser.Scene {

    constructor() {
        super('Pause');
        this.config = config;
    }

    create() {
        this.createText();
    }

    createText() {
        const textStyle = {
            font: '40px CurseCasual',
            fill: '#FFFFFF'
        };
        this.add.graphics()
            .fillStyle(0x000000, 0.7)
            .fillRoundedRect(0, 0, this.config.width, this.config.height);

        this.add.text(this.config.width / 2, 300, 'Back', textStyle).setOrigin(0.5)
            .setInteractive().on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Game');
        });

        this.add.text(this.config.width / 2, 500, 'To Start Menu', textStyle).setOrigin(0.5)
            .setInteractive().on('pointerdown', () => {
            this.scene.stop('Game');
            this.scene.start('Start');
        });
    }
}