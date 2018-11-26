import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FeatureMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';
import { ShowPlaceboardProps, ShowPlaceboard } from '../controls/show-place-board';
import { getIconInfo, IconInfoMap } from '../common/sprite';
import * as icons from '../gen/sprites/icons';
import '../gen/sprites/_icons.scss';
import * as data from '../assets/gas-station.json';


const totalIconMap: IconInfoMap = {...icons.info};

const zoomFrom = 0;
const zoomTo = Number.POSITIVE_INFINITY;

interface GasRecord {
    name: string;
    position: number[];
}

export class ShowGasStationList extends FeatureBase {
    marksList: any[] = []
    constructor(name: string) {
        super(name, [zoomFrom, zoomTo]);
    }

    initChild() {
        this.marksList = data.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark(item: GasRecord): FeatureMarker {
        const cMarker = _().marker(item.position, {icon: makeLeafIcon(totalIconMap, 'fillingstation')});
        cMarker.bindTooltip(item.name);
        return cMarker;
    }

}

function makeLeafIcon(iconMap: IconInfoMap, icon: string) {
    const iconInfo = getIconInfo(iconMap, icon);
    return _().divIcon({
        iconSize: [iconInfo.width, iconInfo.height],
        iconAnchor: [16, 35],
        popupAnchor: [0, -35],
        tooltipAnchor: [16, -17],
        className: iconInfo.className
    });
}
