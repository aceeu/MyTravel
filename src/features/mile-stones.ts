import { Feature, MapMarker, FeatureMarker } from './features-list';
import * as Data from './test1_raw_json.json';
import _ from '../leaflet-define';
import * as azimuth from 'azimuth';

export class MilestonesList implements Feature {
    milestones: MapMarker[] = [];
    map: any;
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    init(map: any) {
        this.map = map;
        let distance: number = 0;
        let last: number = distance;
        let lastPoint: azimuth.Point
        Data.geometry.reduce((a: MapMarker[], element: number[], i: number) => {
            const elPoint: azimuth.Point = convert(element);
            if (a.length == 0) {
                a.push(this.createMark(elPoint, distance));
                lastPoint = elPoint;
                last = distance;
                return a;
            }
            distance += azimuth.azimuth(lastPoint, elPoint).distance;
            if (i == Data.geometry.length - 1) {
                a.push(this.createMark(elPoint, distance));
                return a;
            }
            lastPoint = elPoint;
            if (distance - last > 1000) {
                a.push(this.createMark(elPoint, distance));
                last = distance;
            }
            return a;
        }, this.milestones);
    }

    onZoom(zoom: number) {
        this.milestones.forEach(p => {
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

    createMark(element: azimuth.Point, distance: number): FeatureMarker {
        const cMarker = _().circleMarker([element.lat, element.lng], {color: '#ff0000', radius: 5, fillOpacity: 1});
        cMarker.on('click', (e: any) => alert(`${distance.toFixed(1)}`));
        return {feature: cMarker, distance, zoomFrom: 14, zoomTo: Number.POSITIVE_INFINITY, show: false};
    }
}

function convert(e: number[]): azimuth.Point {
    return {lat: e[0], lng: e[1], elv: e[2]};
}
