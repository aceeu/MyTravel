import { FeatureBase } from './features-list';
import { RouteLine } from '../leaflet';

const zoomFrom = 0;
const zoomTo = Number.POSITIVE_INFINITY;

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
