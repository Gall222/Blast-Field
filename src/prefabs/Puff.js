import Phaser from 'phaser';

export default class Puff extends Phaser.GameObjects.Sprite {
    static generate(scene, x, y) {
        return new Puff({scene, x, y});
    }

    constructor(data) {
        super(data.scene, data.x, data.y, 'puff', 'puff1');
        this.scene.add.existing(this);

        // Сгенерировать набор фреймов текстуры, необходимых для анимации
        const frames = this.scene.anims.generateFrameNames('puff', {
            prefix: 'puff',
            start: 0,
            end: 8
        });

        // Создать новую анимацию на основе полученного набора фреймов
        this.scene.anims.create({
            key: 'puff',
            frames,
            frameRate: 15,
            repeat: 0
        });

        // Запустить анимацию
        this.play('puff');
        if (this.scene.sounds)
            this.scene.sounds.plop.play();
        this.once('animationcomplete', () => {
            this.destroy();
        });
    }
}