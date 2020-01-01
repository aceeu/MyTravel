import _ from '../leaflet-define';

export interface Feature {
    init: (map: any) => void;
    onZoom: (zoom: number) => void;
    getLayerGroup(): any;
    getGroupName(): string | undefined
    name: string;
}

export abstract class FeatureBase implements Feature {
    markers: MapMarker[] = [];
    map: any;
    name: string;
    groupName: string | undefined; // если имена группы FeatureBase будут совпадать они попадут в одну группу в Controls
    layerGroup: any;
    showed: boolean = false;
    zoomRange: number[] = [];

    constructor(name: string, groupName: string, zoomRange: number[]) {
        this.name = name;
        this.zoomRange = zoomRange;
        this.groupName = groupName;
        this.layerGroup = _().layerGroup();
    }

    init(map: any) {
        this.map = map;
        this.initChild();
    }

    getLayerGroup(): any {
        return this.layerGroup;
    }

    getGroupName(): string | undefined {
        return this.groupName;
    }

    abstract initChild(): void;

    onZoom(zoom: number) {
        // if (this.zoomRange[0] <= zoom && this.zoomRange[1] > zoom) {

        //     if ( this.showed == false) {
        //         this.layerGroup.addTo(this.map);
        //         this.showed = true;
        //     }
        // }
        // else {
        //     this.layerGroup.remove();
        //     this.showed = false;
        // }
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

    static FeaturesList(): Feature[]  {
        return FeaturesList.featuresList.container;
    }

    getLayerGroup(){}
    getGroupName(): string | undefined {return}

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
    find(name: string[]): Feature | undefined {
        return FeaturesList.featuresList.container.find(f => name.some(n => n == f.name));
    }
    findFeatures(groupName: string) : Feature[] {
        return FeaturesList.featuresList.container.reduce( (a: Feature[], f) => {
            if (f.getGroupName() == groupName) {
                a.push(f);
            }
            return a;
        }, []);
    }
}


export function RegisterFeature(f: Feature) {
    return FeaturesList.featuresList.register(f);
}

export function UnRegisterOnList(name: string) {
    return FeaturesList.featuresList.unregister(name);
}
