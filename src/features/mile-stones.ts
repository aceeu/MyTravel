import { MapMarker, FeatureMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';
import * as azimuth from 'azimuth';

const zoomFrom = 5;
const zoomTo = Number.POSITIVE_INFINITY;

export class MilestonesList extends FeatureBase {
    geometries: number[][] = [];
    step: number;
    constructor(name: string, groupName: string, geometries: number[][], step: number = 500000, zoom: number[] = [zoomFrom, zoomTo]) {
        super(name, groupName, zoom);
        this.geometries = geometries;
        this.step = step;
    }

    initChild() {
        let distance: number = 0;
        let last: number = distance;
        let lastPoint: azimuth.Point
        this.geometries.reduce((a: MapMarker[], element: number[], i: number) => {
            const elPoint: azimuth.Point = convert(element);
            if (a.length == 0) {
                a.push(this.createMark(elPoint, distance));
                lastPoint = elPoint;
                last = distance;
                return a;
            }
            distance += azimuth.azimuth(lastPoint, elPoint).distance;
            if (i == this.geometries.length - 1) {
                a.push(this.createMark(elPoint, distance));
                return a;
            }
            lastPoint = elPoint;
            if (distance - last > this.step) {
                a.push(this.createMark(elPoint, distance));
                last = distance;
            }
            return a;
        }, this.markers);
        this.geometries = []; // remove geometries
        this.layerGroup = _().layerGroup(this.markers.map(v => v.feature));
    }

    createMark(point: azimuth.Point, distance: number): FeatureMarker {
        const  distanceKm: string = (distance / 1000).toFixed(0);
        const cMarker = _().marker([point.lat, point.lng], {icon: makeMileStoneLeafIcon(distanceKm)});
        return {feature: cMarker, distance};
    }
}

function convert(e: number[]): azimuth.Point {
    return {lat: e[0], lng: e[1], elv: e[2]};
}

function makeMileStoneLeafIcon(distance: string) {
    return _().divIcon({
        iconSize:[40, 25],
        iconAnchor: [2, 25],
        popupAnchor: [0, -25],
        tooltipAnchor: [0, -25],
        html: `<div style="margin-top: -10px;">${distance}</div>`,
        className: 'mile-stone'
    });
}
