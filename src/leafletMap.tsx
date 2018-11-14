import * as React from 'react';
import { LeafletSampleMap, AddRoute, PointFeature } from './leaflet';

interface Props {}

export class LeafletMap extends React.PureComponent<Props> {
    element = React.createRef<HTMLDivElement>();
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
        const map = LeafletSampleMap(this.element.current)
        AddRoute(map);
        PointFeature(map);
    }
}