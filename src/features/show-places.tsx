import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FeatureMarker, LayerGroupFeature } from './features-list';
import { _ } from '../leaflet-define';
import { PoiBallonProps, PoiBallon } from '../controls/poi-ballon-control';
import { getIconInfo, IconInfoMap } from '../common/sprite';
import * as icons from '../gen/sprites/icons';
import '../gen/sprites/_icons.scss';


const totalIconMap: IconInfoMap = {...icons.info};

export interface PoiListData extends PoiBallonProps {
    icon: string;
}

export class PoiList extends LayerGroupFeature {
    marksList: FeatureMarker[] = [];
    data: PoiListData[] = [];
    defaultIcon: string | undefined;

    constructor(name: string, groupName: string, data: PoiListData[], defaultIcon?: string) {
        super(name, groupName);
        this.data = data;
        this.defaultIcon = defaultIcon;
    }

    initChild() {
        this.marksList = this.data.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark = (item: PoiListData): FeatureMarker => {
        const cMarker = _().marker(
            item.position,
            {icon: makeLeafIcon(totalIconMap, item.icon || this.defaultIcon || '')});
        cMarker.bindPopup(() => {
            let element = document.createElement('div');
            showPoiBallon(element, item);
            return element;
        }, {className: 'leafletPopUp'});
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

export function showPoiBallon(element: HTMLElement, item: PoiListData) {
    let props: PoiBallonProps = {
        ...item
    };
    ReactDOM.render(<PoiBallon {...props}/>, element);
}
