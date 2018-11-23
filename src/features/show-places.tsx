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


const totalIconMap: IconInfoMap = {...tourism.info, ...nature.info};

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
        icon: 'tree',
        name: 'Ленину 100 лет',
        position: [54.41965, 56.7827],
        imageUrl: 'https://nashural.ru/assets/uploads/leninu-100-let.jpg',
        text: 'Справедливости ради стоит отметить, что это не единственная подобная надпись в нашей стране, образованная высаженными деревьями. Надпись с аналогичным названием (но меньшего размера) есть в Башкирии около села Архангельское.',
        href: 'https://nashural.ru/mesta/kurganskaya-oblast/les-leninu-100-let/'
    },
    {
        icon: 'mountains',
        name: 'Инзерские зубчатки',
        position: [54.27067, 58.37403],
        imageUrl: 'https://uraloved.ru/images/mesta/bashkiriya/beloreck/inzerskie-zubchatki-1.jpg',
        text: 'Одним из самых красивых мест Южного Урала по праву считаются Инзерские Зубчатки. Это горный хребет в междуречье рек Большой Инзер и Тирлян в Белорецком районе республики Башкортостан.',
        href: 'https://uraloved.ru/mesta/bashkiriya/inzerskie-zubchatki'
    },
    {
        icon: 'landmark',
        name: 'Париж',
        position: [53.29763, 60.09966],
        imageUrl: 'https://nashural.ru/assets/uploads/pariz-1.jpg',
        text: 'Село Париж',
        href: 'https://wikiway.com/russia/selo-parizh/'
    },
    {
        icon: 'smallcity',
        name: 'Берлин',
        position: [54.00604, 61.19336],
        imageUrl: 'http://www.xn--74-6kca2cwbo.xn--p1ai/IMG/im256_30.jpg', 
        text: 'Село Берлин (Челябинская область), для посещения нужно получить разрешение в приграничную зону',
        href: 'http://www.карта74.рф/tourism/cities/berlin/'
    },
    {
        icon: 'smallcity',
        name: 'Парк "Динозаврик"',
        position: [53.64281, 58.80227],
        imageUrl: 'https://nashural.ru/assets/uploads/3-6.jpg', 
        text: 'Детский динопарк динозаврик',
        href: 'https://nashural.ru/mesta/chelyabinskaya-oblast/dinopark-dinozavrik/'
    },
    {
        icon: 'smallcity',
        name: 'Стела Межгорье',
        position:[54.0824, 57.83709],
        imageUrl: 'https://novate.ru/preview/28627s3.jpg?87205',
        text: 'Расположен в 140 км по прямой к юго-востоку от Уфы и в 40 км к северо-западу от Белорецка, на территории Южно-Уральского заповедника у подножья горы Ямантау на высоте около 500 метров над уровнем моря.\
        Межгорье он же «Кузъелга», он же «Солнечный», он же «Уфа-105», он же «Белорецк-16», он же Гоша, он же Гога – это секретный город на Южном Урале, закрытый для туристов и вообще всех. Город расположен рядом с самой высокой горой Урала – Ямантау (1640 м), которая объявлена заповедником и патрулируется не только егерями, но и военными.\
        Город был основан в 1979 году. Немного позже на вершине горы разместились военные гарнизоны Белорецк-15 и Белорецк-16.\
        До 90-х годов никто ничего не знал об этом городке и о том, что происходит внутри горы. Во время правления Ельцина в прессу просочилась информация о том, что в недрах Ямантау построен бункер для членов правительства или же расположена база с ядерными боеголовками. Правительство не дает точных комментариев по этому поводу. Одни говорят, что в горе хранится стратегический запас продуктов питания, другие – государственная сокровищница России.',
        href: 'https://swalker.org/goroda/3412-zakrytyy-gorod-mezhgore.html'
    },
    { // kz
        icon: 'geyser-2',
        name: 'Музей Семипалатинского испытательного полигона',
        position: [50.75151, 78.53411],
        imageUrl: 'https://img.tourister.ru/files/1/1/3/2/8/8/1/6/clones/350_263_fixedwidth.jpg',
        text: 'Этот самый удивительный музей Казахстана расположился в небольшом городе, названном в честь гениального физика И. В. Курчатова, недалеко от Семипалатинска (ныне — Семея). Все экспонаты связаны с ядерной физикой',
        href: 'https://www.tourister.ru/world/asia/kazakhstan/city/kurchatov/museum/25862'
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
