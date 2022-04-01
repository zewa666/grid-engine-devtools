import { observable } from "aurelia";

export class DevtoolsPanel {
  public msg;
  public characters: string[] = [];
  @observable() public selectedCharacter: string;
  public moveToInput: string;

  async attaching() {
    this.msg = this.isGridEngineAvailable() ? "Grid Engine connected" : "No Grid Engine found";
    this.characters = await evaluate<string[]>("window.gridEngine.getAllCharacters()");
  }

  public async moveTo() {
    const [x, y] = this.moveToInput.split(",");
    await evaluate(`window.gridEngine.moveTo("${this.selectedCharacter}", { x: ${x}, y: ${y}})`);
  }

  private async selectedCharacterChanged() {
    const { x, y } = await this.getCharacterPos(this.selectedCharacter);
    this.moveToInput = `${x},${y}`;
  }

  private async isGridEngineAvailable() {
    return await evaluate("!!window.gridEngine");
  }

  private async getCharacterPos(char) {
    return await evaluate<Position>(`window.gridEngine.getPosition("${char}")`);
  }
}

const evaluate = <T>(script) => {
  return new Promise<T>((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(script, (value: T, exc) => {
      if (exc) {
        reject(exc);
        return;
      }

      resolve(value);
    })
  });
}

export interface Position {
  x: number;
  y: number;
}
