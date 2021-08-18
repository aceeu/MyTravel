import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap } from './leafletMap';
import  { entities } from './entities';


ReactDOM.render(
    <LeafletMap 
        onMap={async m => {
            entities.forEach(e => e(m))
        }}
    />, document.getElementById('map'));

