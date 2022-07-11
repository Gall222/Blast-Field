import {config} from '../index';

export default class ScorePanel extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.init();
    }

    init() {
        this.playerSteps = config.maxPlayerSteps;
        this.score = 0;
        this.panelScale = config.width * config.imagesScale * 0.6;
        this.createBackground();
        this.createScore();
        this.createSteps();
    }

    createBackground() {
        this.scorePanel = this.scene.add.image(0, 0, 'score_panel').setScale(this.panelScale);
        this.scorePanel.x = config.width - (this.scorePanel.displayWidth / 2);
        this.scorePanel.y = this.scorePanel.displayHeight / 2 + this.scene.progressBarView.backround.displayHeight;
        this.add(this.scorePanel);
    }

    createScore() {
        this.scorePlace =
            this.scene.add.image(this.scorePanel.x, (this.scorePanel.y + this.scorePanel.displayHeight / 2) - (this.scorePanel.displayHeight * 0.25), 'scoreplace')
                .setScale(this.panelScale);
        this.scoreText = this.scene.add.text(this.scorePlace.x, this.scorePlace.y, 'Score: ' + this.score, {
            font: '200px CurseCasual',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setScale(this.panelScale);
        this.add(this.scorePlace);
        this.add(this.scoreText);
    }

    createSteps() {
        this.stepsPlace =
            this.scene.add.image(this.scorePanel.x, (this.scorePanel.y - this.scorePanel.displayHeight / 2) + (this.scorePanel.displayHeight * 0.3), 'score_panel_steps')
                .setOrigin(0.5).setScale(this.panelScale);
        this.stepsText = this.scene.add.text(this.stepsPlace.x, this.stepsPlace.y, `${this.playerSteps}`, {
            font: '250px CurseCasual',
            fill: '#FFFFFF',
        }).setOrigin(0.5).setScale(this.panelScale);
        this.add(this.stepsPlace);
        this.add(this.stepsText);
    }

    DoStep() {
        this.playerSteps--;
        this.stepsText.setText(this.playerSteps);
        //Конец игры
        if (this.playerSteps <= 0) {
            this.scene.menuMessage = "Steps is over =(";
            this.scene.events.emit('endGame');
        }
    }

    AddScore(points) {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
        this.scene.progressBar.setProgress(this.score);
        //Победа
        if (this.score >= config.scoreToWin) {
            this.scene.menuMessage = "You win!";
            this.scene.events.emit('endGame');
        }
    }
}