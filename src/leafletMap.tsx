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

export class LeafletMap extends React.PureComponent<Props> {
    element = React.createRef<HTMLDivElement>();
    map: any;

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className={'leafletMap'}
                    ref={this.element}
                    id={'leafletmap'}
                ></div>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.map = LeafletBaseMap(this.element.current, config.defaultGPSPos);
        this.props.onMap(this.map);

        let downloadButton = L.Control.extend({
            onAdd: function(map: any) {
                var button = L.DomUtil.create('button');
                button.innerHTML= "Загрузить трек";
                button.onclick = () => {
                    download(`${config.kmlDefaultName}.kml`, genKmlMainroute(config.kmlDefaultName));
                };
                return button;
            },
            onRemove: function(map: any) {
                // Nothing to do here
            }
        });
        new downloadButton({positon: 'topleft'}).addTo(this.map);
    }
}
