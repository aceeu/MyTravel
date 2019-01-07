import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FeatureMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';
import { ShowPlaceboardProps, ShowPlaceboard } from '../controls/show-place-board';
import { getIconInfo, IconInfoMap } from '../common/sprite';
import * as icons from '../gen/sprites/icons';
import '../gen/sprites/_icons.scss';


const totalIconMap: IconInfoMap = {...icons.info};

const zoomFrom = 0;
const zoomTo = Number.POSITIVE_INFINITY;

interface ShowPlacesListData extends ShowPlaceboardProps {
    icon: string;
}

export class ShowPlacesList extends FeatureBase {
    marksList: any[] = [];
    data: any[] = [];
    defaultIcon: string | undefined;
    constructor(name: string, groupName: string, data: any[], defaultIcon?: string) {
        super(name, groupName, [zoomFrom, zoomTo]);
        this.data = data;
        this.defaultIcon = defaultIcon;
    }

    initChild() {
        this.marksList = this.data.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark = (item: ShowPlacesListData): FeatureMarker => {
        const cMarker = _().marker(item.position, {icon: makeLeafIcon(totalIconMap, item.icon || this.defaultIcon || '')});
        cMarker.bindPopup(() => {
            let element = document.createElement('div');
            showPlaceBoard(element, item);
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

function showPlaceBoard(element: HTMLElement, item: ShowPlacesListData) {
    let props: ShowPlaceboardProps = {
        ...item
    };
    ReactDOM.render(<ShowPlaceboard {...props}/>, element);
}
