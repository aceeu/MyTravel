import * as React from 'react';
import { LeafletBaseMap } from './leaflet';
import _ from './leaflet-define';
import { config } from './config';

export type Map = any;

interface Props {
    onMap: (map: Map) => void;
}

export function LeafletMap(props: Props)  {
    const element = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => props.onMap(LeafletBaseMap(element.current, config.defaultGPSPos)), [])
    
    return (
        <div
            className={'leafletMap'}
            ref={element}
            id={'leafletmap'}
        ></div>
    );
}
