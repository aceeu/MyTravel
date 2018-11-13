import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Hello } from './test';
import { LeafletMap } from './leafletMap';

ReactDOM.render(<Hello 
    text='Привет'/>, document.getElementById('app'));

ReactDOM.render(<LeafletMap/>, document.getElementById('map'));
