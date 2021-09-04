import { _ } from '../leaflet-define';

export interface Feature {
    init: (map: any) => void;
    getLayerGroup(): any;
    getGroupName(): string | undefined
    name: string;
}

export abstract class LayerGroupFeature implements Feature {
    markers: MapMarker[] = [];
    map: any;
    name: string;
    groupName: string; // если имена группы FeatureBase будут совпадать они попадут в одну группу в Controls
    layerGroup: any;

    constructor(name: string, groupName: string) {
        this.name = name;
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

    getGroupName(): string {
        return this.groupName;
    }

    abstract initChild(): void;

}

export type FeatureMarker = any;

export interface MapMarker {
    feature: FeatureMarker;
    distance: number;
}


export class FeaturesList {
    map: any;
    container: Array<Feature> = [];

    static featuresList: FeaturesList = new FeaturesList();

    static FeaturesList(): Feature[]  {
        return FeaturesList.featuresList.container;
    }

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

    find(name: string[]): Feature | undefined {
        return FeaturesList.featuresList.container.find((f: Feature) => name.some(n => n == f.name));
    }
    findByGroupName(groupName: string): Feature[] {
        return FeaturesList.featuresList.container.filter((f: Feature) => f.getGroupName() == groupName);
    }
    findFeatures(groupName: string) : Feature[] {
        return FeaturesList.featuresList.container.reduce( (a: Feature[], f) => {
            if (f.getGroupName() == groupName) {
                a.push(f);
            }
            return a;
        }, []);
    }

    getGroupNames(): string[] {
        return FeaturesList.featuresList.container.map(f => f.getGroupName() ?? '')
    }
}


export function RegisterFeature(f: Feature) {
    return FeaturesList.featuresList.register(f);
}

export function UnRegisterOnList(name: string) {
    return FeaturesList.featuresList.unregister(name);
}
