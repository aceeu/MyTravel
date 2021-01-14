import * as React from 'react';
import { LeafletBaseMap } from './leaflet';
import { download } from './download';
import { genKmlMainroute, genKmlAltRoutes } from './kmlgen';
import _ from './leaflet-define';
import { config } from './config';

const L = _();

export type Map = any;

interface Props {
    onMap: (map: Map) => void;
}

export function LeafletMap(props: Props)  {
    const element = React.useRef<HTMLDivElement>(null);

    React.useEffect(
        () => {
            const map = LeafletBaseMap(element.current, config.defaultGPSPos);
            props.onMap(map);
    
            let downloadButton = L.Control.extend({
                onAdd: function(map: any) {
                    var button = L.DomUtil.create('button');
                    button.innerHTML= "Загрузить трек";
                    button.onclick = () => {
                        download(`${config.kmlDefaultName}.kml`, genKmlMainroute(config.kmlDefaultName));
                        download(`${config.kmlAlternatesName}.kml`, genKmlAltRoutes(config.kmlAlternatesName));
                    };
                    return button;
                },
                onRemove: function(map: any) {
                    // Nothing to do here
                }
            });
            new downloadButton({positon: 'topleft'}).addTo(map);
        }, []
    
    )

    
    return (
        <div
            className={'leafletMap'}
            ref={element}
            id={'leafletmap'}
        ></div>
    );
}
