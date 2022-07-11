import Phaser from 'phaser';
import LoadingBar from '../classes/LoadingBar.js';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // this.add.sprite(0, 0, 'bg').setOrigin(0);
        const loadingBar = new LoadingBar(this);
        this.preloadAssets();
    }

    preloadAssets() {
        this.load.image('block', 'public/elements/block.png');
        this.load.image('score_panel', 'public/elements/score_panel.png');
        this.load.image('scoreplace', 'public/elements/score_panel_scoreplace.png');
        this.load.image('score_panel_steps', 'public/elements/score_panel_steps.png');
        this.load.image('rounded_rectangle_large', 'public/elements/rounded_rectangle_large.png');
        this.load.image('pause', 'public/elements/pause.png');
        this.load.image('progress_panel', 'public/elements/progress_panel.png');
        this.load.image('progress_bar_back', 'public/elements/progress_bar_back.png');
        this.load.image('progress_bar_front', 'public/elements/progress_bar_front.png');
        this.load.image('bonus_panel', 'public/elements/bonus_panel.png');
        this.load.atlas('blocks', 'public/blocks/blocks.png', 'public/blocks/blocks.json');
        this.load.atlas('puff', 'public/animations/puff.png', 'public/animations/puff.json');

        this.load.image('bomb', 'public/bonuses/bomb.png');
        this.load.image('super_tile', 'public/bonuses/super_tile.png');
        this.load.image('teleport', 'public/bonuses/teleport.png');

        this.load.audio('theme', 'public/sounds/theme.mp3');
        this.load.audio('plop', 'public/sounds/plop.wav');
    }

    create() {
        this.scene.start('Start');
    }
}