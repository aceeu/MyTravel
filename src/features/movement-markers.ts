import { MapMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';

const zoomFrom = 11;
const zoomTo = Number.POSITIVE_INFINITY;

export class MovementMarkersList extends FeatureBase {


    constructor(name: string, groupName: string) {
        super(name, groupName, [zoomFrom, zoomTo]);
    }

    initChild() {
        // this.markers = GenerateFeaturesGroup(Data);
        // this.layerGroup = _().layerGroup(this.markers.map(v => v.feature));
    }
}

function GenerateFeaturesGroup(Data: any): MapMarker[] {
    let distance = 0;
    return Data.segments[0].steps.map((element: any) => {
        const startPoint = Data.geometry[element.way_points[0]];
        const cMarker = _().circleMarker([startPoint[0], startPoint[1]], {color: '#ff9933', radius: 5, fillOpacity: 1});
        const d = distance;
        cMarker.bindPopup(`${d.toFixed(1)} - ${element.instruction}`);
        cMarker.on('click', (e: any) => e.openPopup());
        distance += element.distance;
        return {feature: cMarker, distance};
    });
}
