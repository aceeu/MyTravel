import { MapMarker, FeatureMarker, LayerGroupFeature } from './features-list';
import { _ } from '../leaflet-define';
import * as azimuth from 'azimuth';
import { featureType } from 'feature-factory';

export class Milestones extends LayerGroupFeature {
    geometries: number[][] = [];
    step: number;
    color: string;
    constructor(name: string,
            groupName: string,
            geometries: number[][],
            step: number = 100000,
            color: string = 'black') {
        super(name, groupName);
        this.geometries = geometries;
        this.step = step;
        this.color = color;
    }

    initChild() {
        let distance: number = 0;
        let last: number = distance;
        let lastPoint: azimuth.Point
        const geometry = this.geometries.map(v => [v[1], v[0], v[2]]) // swap x and y
        geometry.reduce((a: MapMarker[], element: number[], i: number) => {
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

    getType(): featureType {return 'milestones'}

    createMark(point: azimuth.Point, distance: number): FeatureMarker {
        const  distanceKm: string = (distance / 1000).toFixed(0);
        const cMarker = _().marker([point.lat, point.lng], {icon: makeMileStoneLeafIcon(distanceKm, this.color)});
        return {feature: cMarker, distance};
    }
}

function convert(e: number[]): azimuth.Point {
    return {lat: e[0], lng: e[1], elv: e[2]};
}

function makeMileStoneLeafIcon(distance: string, color: string) {
    return _().divIcon({
        iconSize:[40, 25],
        iconAnchor: [2, 25],
        popupAnchor: [0, -25],
        tooltipAnchor: [0, -25],
        html: `<div style="margin-top: -10px; color: ${color}">${distance}</div>`,
        className: 'mile-stone'
    });
}
