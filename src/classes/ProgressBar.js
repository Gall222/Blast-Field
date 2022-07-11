export default class ProgressBar {
    constructor({scene, progressBox, progressBar, winScore}) {
        this.scene = scene;
        this.progressBox = progressBox;
        this.progressBar = progressBar;
        this.winScore = winScore;
        this.progressBar.displayWidth = 0;
        this.maxWidth = this.progressBox.displayWidth - 2;
    }

    setProgress(score) {
        let scorePercent = (score * 100) / this.winScore,
            newBarWidth = (this.maxWidth * scorePercent) / 100;
        this.progressBar.displayWidth = newBarWidth > this.maxWidth ? this.maxWidth : newBarWidth;
    }
}