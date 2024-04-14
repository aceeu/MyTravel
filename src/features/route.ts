import { LayerGroupFeature } from './features-list';
import { _ } from '../leaflet-define';
import { showPoiBallon } from './show-places';

function RouteLine(geometry: number[][], color:string, name: string = '', description = '') {
    geometry = geometry.map(v => [v[1], v[0], v[2]]) // swap x and y
    const polyline = _().polyline(geometry, {weight: 3, color: color || '#ff5555', opacity: 0.9});
    polyline.bindPopup(() => {
        let element = document.createElement('div');
        showPoiBallon(element, {name, position: [], text: description, icon: '', gravity: 4});
        return element;
    }, {className: 'leafletPopUp'});
    polyline.bindTooltip(name);
    return polyline;
}

export class Route extends LayerGroupFeature {
    
    geometries: number[][] = [];
    color: string;
    description: string;
    
    constructor(name: string, groupName: string, geometries: number[][],
            color: string, description: string) {
        super(name, groupName);
        this.geometries = geometries;
        this.color = color;
        this.description = description;
    }

    initChild(): void {
        RouteLine(this.geometries, this.color, this.name, this.description).addTo(this.layerGroup);
    }
    
}

