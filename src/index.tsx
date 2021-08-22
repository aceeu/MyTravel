import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LeafletMap } from './leafletMap';
import  { entities } from './entities';
import { Map } from './leafletMap';


ReactDOM.render(
    <LeafletMap 
        onMap={
            (m) => {
                async function f(m: Map) {
                    await Promise.all(entities.map(e => e(m)))
                }
                f(m)
            }
        }
    />, document.getElementById('map'));

