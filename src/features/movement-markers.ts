import { Feature, MapMarker } from './features-list';
import * as Data from './test1_raw_json.json';
import _ from '../leaflet-define';


export class MovementMarkersList implements Feature {
    pointFeatures: MapMarker[] = [];
    map: any;
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    init(map: any) {
        this.map = map;
        this.pointFeatures = GenerateFeatures();
    }

    onZoom(zoom: number) {
        this.pointFeatures.forEach(p => {
            if (p.zoomFrom <= zoom && p.zoomTo > zoom) {
    
                if ( p.show == false) {
                    p.feature.addTo(this.map);
                    p.show = true;
                }
            }
            else {
                p.feature.remove();
                p.show = false;
            }
        });
    }
}

function GenerateFeatures(): MapMarker[] {
    let distance = 0;
    return Data.segments[0].steps.map((element: any) => {
        const startPoint = Data.geometry[element.way_points[0]];
        const cMarker = _().circleMarker([startPoint[0], startPoint[1]], {color: '#ff9933', radius: 5, fillOpacity: 1});
        const d = distance;
        cMarker.on('click', (e: any) => alert(`${d.toFixed(1)} - ${element.instruction}`));
        distance += element.distance;
        return {feature: cMarker, distance, zoomFrom: 11, zoomTo: 100, show: false};
    });
}
