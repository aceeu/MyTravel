export interface Feature {
    init: (map: any) => void;
    onZoom: (zoom: number) => void;
    getLayerGroup(): any;
    name: string;
}

export abstract class FeatureBase {
    markers: MapMarker[] = [];
    map: any;
    name: string;
    layerGroup: any;
    showed: boolean = false;
    zoomRange: number[] = [];

    constructor(name: string, zoomRange: number[]) {
        this.name = name;
        this.zoomRange = zoomRange;
    }

    init(map: any) {
        this.map = map;
        this.initChild();
    }

    getLayerGroup(): any {
        return this.layerGroup;
    }

    abstract initChild(): void;

    onZoom(zoom: number) {
        if (this.zoomRange[0] <= zoom && this.zoomRange[1] > zoom) {

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

    static FeaturesGroupList(): {name: string, group: any}[]  {
        return FeaturesList.featuresList.container.map(f => ({name: f.name, group: f.getLayerGroup()}));
    }

    getLayerGroup(){}

    register(f: Feature) {
        this.container.push(f);
    }

    unregister(name: string) {
       this.container = this.container.filter(v => v.name != name);
    }

    init(map: any) {
        this.map = map;
        this.container.forEach(f => f.init(this.map))
    }
    onZoom() {
        let z = this.map.getZoom();
        console.log('zoom=' + z);
        this.container.forEach(f => f.onZoom(z));
    }
}


export function RegisterFeature(f: Feature) {
    return FeaturesList.featuresList.register(f);
}

export function UnRegisterOnList(name: string) {
    return FeaturesList.featuresList.unregister(name);
}
