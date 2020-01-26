import * as React from 'react';
import { LeafletBaseMap } from './leaflet';
import { download } from './download';
import { genKmlMainroute, genKmlAltRoutes } from './kmlgen';

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

    kmlClick = () => {
        // let s = genKmlMainroute();
        download('baikal19.kml', genKmlMainroute());
        download('baikal19-alt.kml', genKmlAltRoutes());
    }

    kmlExportButton() {
        // return null; // kml
        return <div
            className={'kml-button'}
            onClick={this.kmlClick}
        >kml
        </div>
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className={'leafletMap'}
                    ref={this.element}
                    id={'leafletmap'}
                ></div>
                {this.kmlExportButton()}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.map = LeafletBaseMap(this.element.current, [54.794, 55.711]);
        this.props.onMap(this.map);
    }
}
