export default class Tile extends Phaser.GameObjects.Sprite {
    static generateAttributes() {
        let randomNum = Phaser.Math.Between(1, 5);
        return {
            frame: `block${randomNum}`,
            colorNum: randomNum,
            velocity: 500,
            points: 1
        };
    }

    constructor(data) {
        super(data.scene, data.x, data.y, data.texture, data.frame);
        this.init(data);

    }

    init({blockSize, colorNum, velocity, positionId, row, points}) {
        this.displayWidth = this.displayHeight = blockSize;
        this.colorNum = colorNum;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.enable = true;
        this.velocity = velocity;
        this.scene.events.on('update', this.update, this);
        this.positionId = positionId;
        this.row = row;
        this.points = points;
        this.checked = false;
    }

    MoveTile(params) {
        this.movingTween = this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            ease: 'Linear',
            duration: params.velocity,
            onComplete: () => {
                delete this.movingTween;
                if (params.callback) {
                    params.callback();
                }
            }
        });

    }

    reset(params) {
        this.x = params.x;
        this.y = params.y;
        this.colorNum = params.colorNum;
        this.setFrame(params.frame);
        this.setAlive(true);
    }


    setAlive(status) {
        // активировать/деактивировать физическое тело
        this.body.enable = status;
        // скрыть/показать текстуру
        this.setVisible(status);
        // деактивировать/активироть объект
        this.setActive(status);

        if (this.timer) {
            this.timer.paused = !status;
        }

        if (!status) {
            this.emit('killed');
        }
    }

}