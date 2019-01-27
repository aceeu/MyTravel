import * as React from 'react';
import { LeafletBaseMap } from './leaflet';

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
            <div
                className={'leafletMap'}
                ref={this.element}
                id={'leafletmap'}
            ></div>
        )
    }

    componentDidMount() {
        this.map = LeafletBaseMap(this.element.current, [50.29666, 81.66445]);
        this.props.onMap(this.map);
    }
}
