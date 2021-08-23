import * as React from 'react';
import _ from './leaflet-define';
import { config } from './config';
import { baseLayers } from './leaflet';

export type Map = any;

interface Props {
    onMap: (map: Map) => void;
}


export function LeafletBaseMap(element: HTMLDivElement, startPos: number[]) {

    let mymap = _().map(element, {
        center: startPos,
        zoom: 7,
        layers: [baseLayers["Outdoors"]]
    });

    return mymap;
}


export function LeafletMap(props: Props)  {
    const element = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => props.onMap(LeafletBaseMap(element.current!, config.defaultGPSPos)), [])
    
    return (
        <div
            className={'leafletMap'}
            ref={element}
            id={'leafletmap'}
        ></div>
    );
}
