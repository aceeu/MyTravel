import { FeatureMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';
import { getIconInfo, IconInfoMap } from '../common/sprite';
import * as icons from '../gen/sprites/icons';
import '../gen/sprites/_icons.scss';


const totalIconMap: IconInfoMap = {...icons.info};

const zoomFrom = 0;
const zoomTo = Number.POSITIVE_INFINITY;

interface GasRecord {
    name: string;
    position: number[];
}

export class SimplePointsList extends FeatureBase {
    marksList: any[] = [];
    data: any[];
    icon: string;

    constructor(name: string, groupName: string, data: any[], icon: string) {
        super(name, groupName, [zoomFrom, zoomTo]);
        this.data = data;
        this.icon = icon;
    }

    initChild() {
        this.marksList = this.data.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark = (item: GasRecord): FeatureMarker => {
        const cMarker = _().marker(item.position, {icon: makeLeafIcon(totalIconMap, this.icon)});
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
