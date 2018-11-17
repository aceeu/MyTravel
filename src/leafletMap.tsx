import * as React from 'react';
import { LeafletSampleMap, Route } from './leaflet';
import { FeaturesList} from './features/features-list';

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
        this.map = LeafletSampleMap(this.element.current);
        this.map.on('zoom', () => this.props.featuresList.onZoom());
        Route(this.map);
        this.props.featuresList.setMap(this.map);
        this.props.featuresList.init();
        this.props.featuresList.onZoom();
    }
}