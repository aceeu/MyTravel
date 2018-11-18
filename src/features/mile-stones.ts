import { Feature, MapMarker, FeatureMarker } from './features-list';
import * as Data from './test1_raw_json.json';
import _ from '../leaflet-define';
import * as azimuth from 'azimuth';

const zoomFrom = 14;
const zoomTo = Number.POSITIVE_INFINITY;

export class MilestonesList implements Feature {
    milestones: MapMarker[] = [];
    map: any;
    name: string;
    layerGroup: any;
    showed: boolean = false;
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
        this.layerGroup = _().layerGroup(this.milestones.map(v => v.feature));
    }

    onZoom(zoom: number) {
        this.milestones.forEach(p => {
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
        });
    }

    createMark(element: azimuth.Point, distance: number): FeatureMarker {
        const cMarker = _().circleMarker([element.lat, element.lng], {color: '#ff0000', radius: 5, fillOpacity: 1});
        cMarker.bindPopup(`${distance.toFixed(1)}`);
        cMarker.on('click', (e: any) => e.openPopup());
        return {feature: cMarker, distance};
    }
}

function convert(e: number[]): azimuth.Point {
    return {lat: e[0], lng: e[1], elv: e[2]};
}
