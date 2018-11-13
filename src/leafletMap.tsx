import * as React from 'react';
import { LeafletSampleMap } from './leaflet';

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
        LeafletSampleMap(this.element.current, [50.07349, 88.42224])
    }
}