import Phaser from 'phaser';
import BonusesController from '../classes/BonusesController.js';
import ScorePanel from '../prefabs/ScorePanel.js';
import Tiles from '../prefabs/Tiles.js';
import ProgressBarView from '../prefabs/ProgressBarView.js';
import ProgressBar from '../classes/ProgressBar.js';
import PauseMenu from '../prefabs/PauseMenu.js';
import ShakePanel from '../prefabs/ShakePanel.js';
import ShakeModel from '../classes/ShakeModel.js';
import {config} from '../index';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isGameAlive = true;
        this.isClickAble = true;
        //сообщение о результатах партии
        this.menuMessage = false;
        //если выбран бонус, он активируется по клику на поле
        this.activeBonus = null;
    }

    create(data) {
        this.createBackground();
        this.fieldSizeHorizontal = data.fieldSizeHorizontal;
        this.fieldSizeVertical = data.fieldSizeVertical;
        //размер блоков зависит от размера экрана
        this.blockSize = config.width * config.blockScaleToScreen;
        this.createProgressBar();
        this.scoreMenu = new ScorePanel(this);
        //контейнер тайлов с логикой для работы с ними
        this.tiles = new Tiles(this);
        //распределяет логику бонусов
        this.bonusesController = new BonusesController({
            scene: this
        });
        this.createPauseMenu();
        //перемешивания поля: если нет комбинация тайлов, перемешивает
        this.createShakePanel();
        //рамка
        this.createBorderPlace();
        this.setEvents();
        //стартовая проверка на перемешивание
        this.events.emit('shake');
        if (!this.sounds) {
            this.createSounds();
        }
    }

    setEvents() {
        this.events.on('shake', () => {
            this.shakeModel.checkTiles();
        }, this);
        this.events.once('endGame', this.endGame, this);
    }

    createProgressBar() {
        this.progressBarView = new ProgressBarView({
            scene: this,
            x: config.width / 2,
            y: 0
        });
        this.progressBar = new ProgressBar({
            scene: this,
            progressBox: this.progressBarView.progressBox,
            progressBar: this.progressBarView.progressBar,
            winScore: config.scoreToWin,
        });
    };

    createPauseMenu() {
        this.pauseMenu = new PauseMenu({
            scene: this,
            x: config.width,
            y: 0
        });
    };

    createShakePanel() {
        let view = new ShakePanel({
            scene: this,
            x: 10,
            y: 10,
        });
        this.shakeModel = new ShakeModel({
            scene: this,
            view: view,
            shakeCount: config.shakeCount,
            tiles: this.tiles
        })
    }

    endGame() {
        if (!this.isGameAlive) {
            return;
        }
        this.isGameAlive = false;
        this.gameOverTimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.scene.start('Start', {
                    score: this.scoreMenu.score,
                    message: this.menuMessage
                });
            },
            callbackScope: this
        });
    }

    createSounds() {
        this.sounds = {
            plop: this.sound.add('plop', {volume: 0.7}),
            theme: this.sound.add('theme', {volume: 0.3, loop: true})
        };

        this.sounds.theme.play();
    }

    update() {

    }

    createBorderPlace() {
        let indent = 10;
        let firstBlock = this.tiles.children.entries[0],
            lastBlock = this.tiles.children.entries[this.tiles.children.entries.length - 1];
        let firstBlockPosX = firstBlock.x - firstBlock.displayWidth / 2 - indent,
            firstBlockPosY = firstBlock.y - firstBlock.displayHeight / 2 - indent;
        this.add.graphics()
            .lineStyle(2, 0x72b0c1, 1)
            .strokeRoundedRect(
                firstBlockPosX,
                firstBlockPosY,
                (lastBlock.x + lastBlock.displayWidth / 2 + indent) - firstBlockPosX,
                (lastBlock.y + lastBlock.displayHeight / 2 + indent) - firstBlockPosY);
    }

    createBackground() {
        this.add.graphics()
            .fillStyle(0x0b2a53, 0.7)
            .fillRect(0, 0, config.width, config.height);
    }
}