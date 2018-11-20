import * as React from 'react';
import { LeafletBaseMap, Route } from './leaflet';
import { FeaturesList} from './features/features-list';
import * as DataJson from './assets/maintrack.json';

interface Props {
    featuresList: FeaturesList;
}

export class LeafletMap extends React.PureComponent<Props> {
    element = React.createRef<HTMLDivElement>();
    map: any;

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div
                className={'leafletMap'}
                ref={this.element}
                id={'leafletmap'}
            ></div>
        )
    }

    componentDidMount() {
        this.map = LeafletBaseMap(this.element.current, [DataJson.geometry[0][0], DataJson.geometry[0][1]]);
        this.map.on('zoom', () => this.props.featuresList.onZoom());
        Route(this.map, DataJson.geometry);
        this.props.featuresList.setMap(this.map);
        this.props.featuresList.init({geometry: DataJson.geometry, segments: DataJson.segments});
        this.props.featuresList.onZoom();
    }
}