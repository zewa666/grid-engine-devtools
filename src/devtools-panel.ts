import { observable } from "aurelia";
import { SUT } from "./constants";
import { evaluate } from "./helper/inject";
import { Position } from "./models";

export class DevtoolsPanel {
  public msg;
  public characters: string[] = [];
  @observable() public selectedCharacter: string;
  public moveToInput: string;

  async attaching() {
    this.msg = this.isGridEngineAvailable() ? "Grid Engine connected" : "No Grid Engine found";
    this.characters = await evaluate<string[]>(`window.${SUT}.getAllCharacters()`);
  }

  public async moveTo() {
    const [x, y] = this.moveToInput.split(",");
    await evaluate(`window.${SUT}.moveTo("${this.selectedCharacter}", { x: ${x}, y: ${y}})`);
  }

  private async selectedCharacterChanged() {
    const { x, y } = await this.getCharacterPos(this.selectedCharacter);
    this.moveToInput = `${x},${y}`;
  }

  private async isGridEngineAvailable() {
    return await evaluate(`!!window.${SUT}`);
  }

  private async getCharacterPos(char) {
    return await evaluate<Position>(`window.${SUT}.getPosition("${char}")`);
  }
}
