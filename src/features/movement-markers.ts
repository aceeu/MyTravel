import { Feature, MapMarker } from './features-list';
import * as Data from './test1_raw_json.json';
import _ from '../leaflet-define';

const zoomFrom = 11;
const zoomTo = Number.POSITIVE_INFINITY;

export class MovementMarkersList implements Feature {
    pointFeatures: MapMarker[] = [];
    layerGroup: any;
    showed: boolean = false;
    map: any;
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    init(map: any) {
        this.map = map;
        this.pointFeatures = GenerateFeaturesGroup();
        this.layerGroup = _().layerGroup(this.pointFeatures.map(v => v.feature));
    }

    onZoom(zoom: number) {
        if (zoomFrom <= zoom && zoomTo > zoom) {

            if ( this.showed == false) {
                this.layerGroup.addTo(this.map);
                this.showed = true;
            }
        }
        else {
            this.layerGroup.remove();
            this.showed = false;
        }
    }
}

function GenerateFeaturesGroup(): MapMarker[] {
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
