import { observable } from "aurelia";

import { SUT } from "./constants";
import { evaluate } from "./helper/inject";
import { Position } from "./models";

export class DevtoolsPanel {
  public msg;
  public characters: string[] = [];
  @observable() public selectedCharacter: string;
  public moveToInput: string;
  public moveRandomDelayInput: number;
  public moveRandomRadiusInput: number;
  public selectedDirection = "";
  public directions = [
    "up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"
  ];
  public selectedFollowTarget: string;
  public followClosestPointIfBlockedInput = false;
  public followDistanceInput: number;
  public gridEngineAvailable = false;

  public get followTargets() {
    return this.characters.filter(c => c !== this.selectedCharacter);
  }

  public get isValidPosition() {
    if (!this.moveToInput || !this.moveToInput.match(/^[^,]*,[^,]*$/gm)) {
      return true;
    }

    return !this.moveToInput.split(",").map(i => i.trim()).every(i => parseInt(i, 10) >= 0);
  }

  async attaching() {
    this.gridEngineAvailable = await this.isGridEngineAvailable();

    if (this.gridEngineAvailable) {
      this.characters = await evaluate<string[]>(`window.${SUT}.getAllCharacters()`);
    }
  }

  public async follow() {
    if (!this.gridEngineAvailable) return;
    await evaluate(`window.${SUT}.follow("${this.selectedCharacter}", "${this.selectedFollowTarget}", ${this.followDistanceInput || 0}, ${this.followClosestPointIfBlockedInput === true ? 'true' : 'false'})`);
  }

  public async stopMovement() {
    if (!this.gridEngineAvailable) return;
    await evaluate(`window.${SUT}.stopMovement("${this.selectedCharacter}")`);
  }

  public async turnTowards() {
    if (!this.gridEngineAvailable) return;
    await evaluate(`window.${SUT}.turnTowards("${this.selectedCharacter}", "${this.selectedDirection}")`);
  }

  public async teleport() {
    if (!this.gridEngineAvailable) return;
    const [x, y] = this.moveToInput.split(",");
    await evaluate(`window.${SUT}.setPosition("${this.selectedCharacter}", { x: ${x}, y: ${y}})`);
  }

  public async moveTo() {
    if (!this.gridEngineAvailable) return;
    const [x, y] = this.moveToInput.split(",");
    await evaluate(`window.${SUT}.moveTo("${this.selectedCharacter}", { x: ${x}, y: ${y}})`);
  }

  public async moveRandom() {
    if (!this.gridEngineAvailable) return;
    await evaluate(`window.${SUT}.moveRandomly("${this.selectedCharacter}", ${this.moveRandomDelayInput || 0}, ${this.moveRandomRadiusInput || -1})`);
  }

  private async selectedCharacterChanged() {
    if (!this.gridEngineAvailable) return;
    const { x, y } = await this.getCharacterPos(this.selectedCharacter);
    this.moveToInput = `${x},${y}`;
  }

  private async isGridEngineAvailable() {
    return await evaluate<boolean>(`!!window.${SUT}`);
  }

  private async getCharacterPos(char) {
    return await evaluate<Position>(`window.${SUT}.getPosition("${char}")`);
  }
}
