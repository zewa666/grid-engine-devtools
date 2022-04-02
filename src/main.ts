// if ((module as any).hot) {
//   (module as any).hot.accept()
// }

import Aurelia from 'aurelia';
import { PositionPicker } from './components/position-picker';
import { DevtoolsPanel } from './devtools-panel';

Aurelia
  .register(PositionPicker)
  .app(DevtoolsPanel)
  .start();
