import { FeatureMarker, LayerGroupFeature } from './features-list';
import { _ } from '../leaflet-define';
import { getIconInfo, IconInfoMap } from '../common/sprite';
import * as icons from '../gen/sprites/icons';
import '../gen/sprites/_icons.scss';


const totalIconMap: IconInfoMap = {...icons.info};

interface Pos {
    lat: number,
    lng: number
}

export class SimplePointsList extends LayerGroupFeature {
    marksList: any[] = [];
    data: any[];
    icon: string;

    constructor(name: string, groupName: string, data: any[], icon: string) {
        super(name, groupName);
        this.data = data;
        this.icon = icon;
        console.log({data})
    }

    initChild() {
        this.marksList = this.data.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark = (item: Pos, i: number): FeatureMarker => {
        const cMarker = _().marker([item.lat, item.lng], {icon: makeLeafIcon(totalIconMap, this.icon)});
        cMarker.bindTooltip(this.name + '_' + i);
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
