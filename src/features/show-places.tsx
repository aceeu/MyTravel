import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FeatureMarker, FeatureBase } from './features-list';
import _ from '../leaflet-define';
import { ShowPlaceboardProps, ShowPlaceboard } from '../controls/show-place-board';
import TreeIcon from '../assets/nature_icons/tree.png';
import MontainIcon from '../assets/nature_icons/mountains.png';
import Tower from '../assets/tourism_icons/landmark.png';
import Smallcity from '../assets/tourism_icons/smallcity.png';



const zoomFrom = 0;
const zoomTo = 100;

interface ShowPlacesListData {
    icon: string; // marker icon
    name: string;
    position: number[]; // lat, lng
    imageUrl: string;
    text?: string;
    href: string;
}

const list: ShowPlacesListData[] = [
    {
        icon: TreeIcon,
        name: 'Ленину 100 лет',
        position: [54.41965, 56.7827],
        imageUrl: 'https://nashural.ru/assets/uploads/leninu-100-let.jpg',
        text: 'Одна из самых оригинальных достопримечательностей Курганской области – лес, посаженный в виде огромной надписи «Ленину 100 лет». Эту надпись можно разглядеть даже из космоса. Собственно, именно по космическим снимкам через сервис Google Earth она и была обнаружена энтузиастами, благодаря которым об этом месте стало известно широкой общественности. До этого о лесе «Ленину 100 лет» знали лишь местные жители.',
        href: 'https://nashural.ru/mesta/kurganskaya-oblast/les-leninu-100-let/'
    },
    {
        icon: MontainIcon,
        name: 'Инзерские зубчатки',
        position: [54.27067, 58.37403],
        imageUrl: 'https://uraloved.ru/images/mesta/bashkiriya/beloreck/inzerskie-zubchatki-1.jpg',
        text: 'Одним из самых красивых мест Южного Урала по праву считаются Инзерские Зубчатки. Это горный хребет в междуречье рек Большой Инзер и Тирлян в Белорецком районе республики Башкортостан.',
        href: 'https://uraloved.ru/mesta/bashkiriya/inzerskie-zubchatki'
    },
    {
        icon: Tower,
        name: 'Париж',
        position: [53.29763, 60.09966],
        imageUrl: 'https://wikiway.com/upload/resize_cache/hl-photo/547/68f/1024_800_1/selo_parizh_14.jpg',
        text: 'Село Париж',
        href: 'https://wikiway.com/russia/selo-parizh/'
    },
    {
        icon: Smallcity,
        name: 'Берлин',
        position: [54.00604, 61.19336],
        imageUrl: 'http://www.xn--74-6kca2cwbo.xn--p1ai/IMG/im256_30.jpg', 
        text: 'Село Берлин (Челябинская область), для посещения нужно получить разрешение в приграничную зону',
        href: 'http://www.карта74.рф/tourism/cities/berlin/'
    },
    {
        icon: Smallcity,
        name: 'Парк "Динозаврик"',
        position: [53.64281, 58.80227],
        imageUrl: 'https://nashural.ru/assets/uploads/3-6.jpg', 
        text: 'Детский динопарк динозаврик',
        href: 'https://nashural.ru/mesta/chelyabinskaya-oblast/dinopark-dinozavrik/'
    }
]

export class ShowPlacesList extends FeatureBase {
    marksList: any[] = []
    constructor(name: string) {
        super(name, [zoomFrom, zoomTo]);
    }

    initChild() {
        this.marksList = list.map(this.createMark);
        this.layerGroup = _().layerGroup(this.marksList);
    }

    createMark(item: ShowPlacesListData): FeatureMarker {
        const cMarker = _().marker(item.position, {icon: makeLeafIcon(item.icon)});
        cMarker.bindPopup(() => {
            let element = document.createElement('div');
            exampleShowPlaceBoard(element, item);
            return element;
        }, {className: 'leafletPopUp'});
        cMarker.bindTooltip(item.name);
        return cMarker;
    }

}

function makeLeafIcon(icon: string) {
    return _().icon({
        iconUrl: icon,
        iconSize:[32, 37],
        iconAnchor: [16, 35],
        popupAnchor: [0, -35],
        tooltipAnchor: [16, -17]
    });
}

function exampleShowPlaceBoard(element: HTMLElement, item: ShowPlacesListData) {
    let props: ShowPlaceboardProps = {
        ...item
    };
    ReactDOM.render(<ShowPlaceboard {...props}/>, element);
}
