import * as React from 'react';
import { _ } from './leaflet-define';
import { getBaseLayers } from './leaflet';

export type Map = any;

interface Props {
    onMap: (map: Map) => void;
}


export function LeafletBaseMap(element: HTMLDivElement) {

    let mymap = _().map(element, {
        center: [0, 0],
        zoom: 5,
        layers: [getBaseLayers()["Outdoors"]]
    });

    mymap.on('zoom', () => console.log(mymap.getZoom()))

    mymap.on('click', function(event: any){
        console.log('----click----')
        console.log(event.latlng)
    });

    return mymap;
}


export function LeafletMap(props: Props)  {
    const element = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => props.onMap(LeafletBaseMap(element.current!)), [])
    
    return (
        <div
            className={'leafletMap'}
            ref={element}
            id={'leafletmap'}
        ></div>
    );
}
