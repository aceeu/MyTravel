import * as ReactDOM from 'react-dom';
function appendToBody() {
  return document.body.appendChild(document.createElement('div'));
}
  
function removeFromBody(e: HTMLElement) {
    ReactDOM.unmountComponentAtNode(e);
    document.body.removeChild(e);
}

export function defer(makeContentFunc: (res: (button: string) => void) => JSX.Element) {
    const parent = appendToBody();
    const onClose = () => removeFromBody(parent);
    const body = function(resolve: (button: string) => void) {
        ReactDOM.render(makeContentFunc(resolve), parent)
    };
    return new Promise(body).finally(onClose);
}
