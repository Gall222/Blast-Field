import Phaser from 'phaser';
import {config} from '../index';

export default class StartScene extends Phaser.Scene {

    constructor() {
        super('Start');
        this.config = config;
    }

    create(data) {
        if (data.score !== undefined) {
            this.createStats(data);
        }
        this.createText();
    }

    createStats(data) {
        this.add.graphics()
            .fillStyle(0x000000, 0.5)
            .fillRoundedRect(this.config.width / 2 - 200, this.config.height / 2 - 200, 400, 400);
        const textTitle = data.message;
        const textScore = `Score: ${data.score}`;
        const textStyle = {
            font: '40px CurseCasual',
            fill: '#FFFFFF'
        };
        this.add.text(this.config.width / 2, 100, textTitle, textStyle).setOrigin(0.5);
        this.add.text(this.config.width / 2, 150, textScore, textStyle).setOrigin(0.5);
    }

    createText() {
        this.smallText = this.add.text(this.config.width / 2, 300, 'Small Field', {
            font: '40px CurseCasual',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.StartGame({fieldSizeHorizontal: 5, fieldSizeVertical: 5});
        });

        this.mediumText = this.add.text(this.config.width / 2, 400, 'Medium Field', {
            font: '40px CurseCasual',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.StartGame({fieldSizeHorizontal: 7, fieldSizeVertical: 8});
        });
        this.bigText = this.add.text(this.config.width / 2, 500, 'Big Field', {
            font: '40px CurseCasual',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.StartGame({fieldSizeHorizontal: 9, fieldSizeVertical: 11});
        });

    }

    StartGame(data) {
        this.scene.start('Game', {
            fieldSizeHorizontal: data.fieldSizeHorizontal,
            fieldSizeVertical: data.fieldSizeVertical
        });
    }
}