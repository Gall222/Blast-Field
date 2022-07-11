import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';

export let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 800,
    blockScaleToScreen: 0.1,
    imagesScale: 0.0004,
    blocksColorCount: 5,
    minBlocksToUltimateTile: 5,
    minBlockToDestroy: 3,
    shakeCount: 3,
    maxPlayerSteps: 30,
    scoreToWin: 100,

    scene: [BootScene, PreloadScene, StartScene, GameScene, PauseScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

export default new Phaser.Game(config);
