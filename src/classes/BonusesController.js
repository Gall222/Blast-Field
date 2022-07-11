import BoosterBomb from '../classes/BoosterBomb.js';
import Teleport from '../classes/Teleport.js';
import UltimateTile from '../classes/UltimateTile.js';
import BonusPanel from "../prefabs/BonusPanel";

export default class BonusesController {
    constructor(data) {
        this.scene = data.scene;
        this.boosterBombCount = 3;
        this.teleportCount = 3;
        this.ultimateCount = 3;
        //создаем модели бонусов и передаем им представления
        this.boosterBomb = new BoosterBomb({scene: this.scene, controller: this, tilesRadius: 2});
        this.teleport = new Teleport({scene: this.scene, controller: this,});
        this.ultimateTile = new UltimateTile({scene: this.scene, controller: this,});
        this.createBonuses();
    }

    createBonuses() {
        let first = new BonusPanel({
            scene: this.scene,
            model: this.boosterBomb,
            x: 10,
            y: this.scene.scoreMenu.scorePanel.y,
            applyCount: this.boosterBombCount,
            bonusImage: 'bomb',
            buttonName: 'BoosterBomb',
            isActiveSkill: true
        });
        let second = new BonusPanel({
            scene: this.scene,
            model: this.teleport,
            x: first.x + (first.displayWidth / 2) + 5,
            y: first.y,
            applyCount: this.teleportCount,
            bonusImage: 'teleport',
            buttonName: 'Teleport',
            isActiveSkill: true
        });
        let third = new BonusPanel({
            scene: this.scene,
            model: this.ultimateTile,
            x: second.x + (second.displayWidth / 2) + 5,
            y: second.y,
            applyCount: this.ultimateCount,
            bonusImage: 'super_tile',
            buttonName: 'BoosterBomb',
            isActiveSkill: false
        });
    }

    onButtonClick(data) {
        if (this.scene.activeBonus) {
            this.deactivateBonus();
        } else {
            this.addButtonFrame(data.button);
            this.addBonus(data.buttonName);

        }
    }

    addBonus(name) {
        switch (name) {
            case 'BoosterBomb':
                this.scene.activeBonus = this.activateBoosterBomb;
                break;
            case 'Teleport':
                this.scene.activeBonus = this.activateTeleport;
                break;
            default :
                this.deactivateBonus();
        }
    }

    activateBoosterBomb(data) {
        if (this.boosterBombCount > 0)
            this.boosterBomb.start(data);
        this.deactivateBonus();
    }

    activateTeleport(data) {
        if (this.teleportCount > 0)
            this.teleport.start(data);
    }

    deactivateBonus() {
        this.frame.destroy();
        this.scene.events.emit('deactivateBonus');
        this.scene.activeBonus = null;
    }

    addButtonFrame(button) {
        this.frame = this.scene.add.graphics()
            .lineStyle(2, 0xffff00, 1)
            .strokeRoundedRect(
                button.x - (button.displayWidth / 2),
                button.y - (button.displayHeight / 2),
                button.displayWidth,
                button.displayHeight);
    }
}