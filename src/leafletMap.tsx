import * as React from 'react';
import { LeafletBaseMap } from './leaflet';
import { FeaturesList} from './features/features-list';

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
        this.map = LeafletBaseMap(this.element.current, [54.0824, 57.83709]);
        this.props.onMap(this.map);
    }
}
