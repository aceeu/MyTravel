import { FeatureBase } from './features-list';
import _ from '../leaflet-define';

const zoomFrom = 0;
const zoomTo = Number.POSITIVE_INFINITY;

function RouteLine(geometry: number[][], color:string) {
    return _().polyline(geometry, {weight: 3, color: color || '#ff5555', opacity: 0.9});
}

export class Route extends FeatureBase {
    
    geometries: number[][] = [];
    color: string;
    
    constructor(name: string, groupName: string, geometries: number[][],
            color: string, zoom: number[] = [zoomFrom, zoomTo]) {
        super(name, groupName, zoom);
        this.geometries = geometries;
        this.color = color;
    }

    initChild(): void {
        RouteLine(this.geometries, this.color).addTo(this.layerGroup);
    }
    
}
