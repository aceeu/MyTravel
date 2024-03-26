import { Feature } from "features/features-list";
import { Map } from './leafletMap';

export type featureType = 'route' | 'poi' | 'pos_route'

export type MetaData2Row = {
    name: string;
    groupName: string;
    type: featureType;
    files: string[];
    color?: string[];
    showByDefault?: boolean; // показывать на карте по умолчанию
    mileStonesOneForAll?: boolean; // вехи для всех один или для каждого отдельно
}

export interface MetaData2 {
    center: [number, number]
    zoon: number,
    data: MetaData2Row[];
}

export interface MetaDataTypeHandler {
    (v: MetaData2Row): Promise<Feature[]>
}
const handlers: {[key: string]: MetaDataTypeHandler}={}

export function registerMetaDataTypeHandler(t: featureType, h: MetaDataTypeHandler) {
    if (t in handlers)
        throw new Error('такой тип уже зарегистрирован');
    handlers[t] = h
}

export function makeFeatureFromMetaData(metaData: MetaData2, map: Map): Promise<Feature[]>[] {
    return metaData.data.reduce((a, v) => {
        const h = handlers[v.type];
        if (!h)
            throw 'Не известный тип: '+ v.type
        a.push(h(v));
        return a;
    }, [] as Promise<Feature[]>[])
}
