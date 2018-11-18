export interface Feature {
    init: (map: any) => void;
    onZoom: (zoom: number) => void;
    name: string;
}

export type FeatureMarker = any;

export interface MapMarker {
    feature: FeatureMarker;
    distance: number;
}


export class FeaturesList implements Feature {
    map: any;
    name: string = 'container';
    container: Array<Feature> = [];

    static featuresList: FeaturesList = new FeaturesList();

    setMap(map: any) {
        this.map = map;
    }

    register(f: Feature) {
        this.container.push(f);
    }

    unregister(name: string) {
       this.container = this.container.filter(v => v.name != name);
    }

    init() {
        this.container.forEach(f => f.init(this.map))
    }
    onZoom() {
        let z = this.map.getZoom();
        this.container.forEach(f => f.onZoom(z));
    }
}


export function RegisterOnList(f: Feature) {
    return FeaturesList.featuresList.register(f);
}

export function UnRegisterOnList(name: string) {
    return FeaturesList.featuresList.unregister(name);
}
