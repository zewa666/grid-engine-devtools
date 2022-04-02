export const evaluate = <T>(script) => {
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
