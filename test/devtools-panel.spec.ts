import { render } from './helper';
import { DevtoolsPanel } from '../src/devtools-panel';

describe('The Devtools Panel', () => {
  it('should render message', async () => {
    const node = (await render('<devtools-panel></devtools-panel>', DevtoolsPanel)).firstElementChild;
    expect(node).toBeDefined();
  });
});
