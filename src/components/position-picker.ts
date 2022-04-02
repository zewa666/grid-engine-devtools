import { bindable, BindingMode, customElement } from "aurelia";
import { v4 as uuidv4  } from "uuid";
import { SUT } from "../constants";
import { evaluate } from "../helper/inject";
import { Position } from "../models";

const POLL_TIMEOUT = 10000;

@customElement({
  name: 'position-picker',
  template: `<button ref="btn" click.trigger="pickPosition()" style="margin-left: -5px; cursor: crosshair;">Ꚛ</button>`
})
export class PositionPicker {
  @bindable({ mode: BindingMode.twoWay }) value: string;
  btn: HTMLButtonElement;
  id: string = uuidv4().replaceAll("-", "");

  public async pickPosition() {
    await evaluate(`!!window.${SUT}.scene.input.once('pointerup', (pointer) => {
      const tile = window.${SUT}.gridTilemap.tilemap.layers[0].tilemapLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      window.${SUT}.pickerResult${this.id} = !tile ? { x: -1, y: -1 } : { x: tile.x, y: tile.y };
    })`);
    this.btn.style.backgroundColor = "lightgreen";

    const result = await new Promise<Position>((resolve, reject) => {
      const pollingInterval = setInterval(async () => {
        try {
          const result = await evaluate<Position>(`window.${SUT}.pickerResult${this.id}`);
          if (result) {
            clearInterval(pollingInterval);
            clearTimeout(timeout);
            await evaluate(`window.${SUT}.pickerResult${this.id} = undefined`);
            this.btn.style.backgroundColor = "";
            resolve(result);
          }
        } catch(e) {
          clearInterval(pollingInterval);
          clearTimeout(timeout);
          this.btn.style.backgroundColor = "";
          reject(e);
        }
      }, 500);

      const timeout = setTimeout(() => {
        clearInterval(pollingInterval);
        this.btn.style.backgroundColor = "";
        reject("Timed out");
      }, POLL_TIMEOUT);
    });

    // -1 means nothing found
    if (result.x !== -1) {
      this.value = `${result.x},${result.y}`;
    }
  }
}
