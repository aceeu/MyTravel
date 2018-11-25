import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FeatureMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';
import { ShowPlaceboardProps, ShowPlaceboard } from '../controls/show-place-board';
import { getIconInfo, IconInfoMap } from '../common/sprite';
import * as tourism from '../gen/sprites/tourism';
import * as nature from '../gen/sprites/nature';
import '../gen/sprites/_tourism.scss';
import '../gen/sprites/_nature.scss';
import * as SPData from '../assets/show-places-data.json';


const totalIconMap: IconInfoMap = {...tourism.info, ...nature.info};

const zoomFrom = 0;
const zoomTo = Number.POSITIVE_INFINITY;

interface ShowPlacesListData extends ShowPlaceboardProps {
    icon: string;
}

export class ShowPlacesList extends FeatureBase {
    marksList: any[] = []
    constructor(name: string) {
        super(name, [zoomFrom, zoomTo]);
    }

    initChild() {
        this.marksList = SPData.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark(item: ShowPlacesListData): FeatureMarker {
        const cMarker = _().marker(item.position, {icon: makeLeafIcon(totalIconMap, item.icon)});
        cMarker.bindPopup(() => {
            let element = document.createElement('div');
            exampleShowPlaceBoard(element, item);
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

function exampleShowPlaceBoard(element: HTMLElement, item: ShowPlacesListData) {
    let props: ShowPlaceboardProps = {
        ...item
    };
    ReactDOM.render(<ShowPlaceboard {...props}/>, element);
}
