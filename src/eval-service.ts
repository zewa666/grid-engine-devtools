import { DEVTOOLS_STORE, SUT } from "./constants";
import { evaluate } from "./helper/inject";

export class EvalService {
  public getAllCharacters() {
    return evaluate<string[]>(`
      if (window.${SUT}?.characterShifted
        && !window.${SUT}?.${DEVTOOLS_STORE}?.charChangedSubscription
        && !window.${SUT}?.${DEVTOOLS_STORE}?.haveCharsChanged) {
        if (!window.${SUT}?.${DEVTOOLS_STORE}) {
          window.${SUT}.${DEVTOOLS_STORE} = {};
        }

        window.${SUT}.${DEVTOOLS_STORE}.charChangedSubscription = window.${SUT}.characterShifted().subscribe(() => {
          window.${SUT}.${DEVTOOLS_STORE}.haveCharsChanged = true;
        });
      }

      window.${SUT}.getAllCharacters();
    `);
  }

  public haveCharactersChanged() {
    return evaluate<boolean>(`!!window.${SUT}?.${DEVTOOLS_STORE}?.haveCharsChanged`);
  }

  public unsetChangedDetection() {
    return evaluate<boolean>(`if (window.${SUT}?.${DEVTOOLS_STORE}) {
      window.${SUT}.${DEVTOOLS_STORE}.haveCharsChanged = undefined
    }`);
  }

  public charChangeDetectionSubAvailable() {
    return evaluate<boolean>(`!!window.${SUT}?.${DEVTOOLS_STORE}?.charChangedSubscription`);
  }

  public isGridEngineAvailable() {
    return evaluate<boolean>(`!!window.${SUT}`);
  }
}
