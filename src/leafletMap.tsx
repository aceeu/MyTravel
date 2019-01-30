import * as React from 'react';
import { LeafletBaseMap } from './leaflet';
import { download } from './download';
import { generateKml } from './kmlgen';

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
        download('test.kml', generateKml());
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className={'leafletMap'}
                    ref={this.element}
                    id={'leafletmap'}
                ></div>
                <div
                    className={'kml-button'}
                    onClick={this.kmlClick}
                >kml
                </div>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.map = LeafletBaseMap(this.element.current, [50.29666, 81.66445]);
        this.props.onMap(this.map);
    }
}
