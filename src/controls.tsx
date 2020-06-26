import * as ReactDOM from 'react-dom';
import * as React from 'react';
import _ from './leaflet-define';
import { StartPresentation } from './presentation'
import waterMarkPng from './assets/watermark.png';
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';
import { FeaturesList } from './features/features-list';
import { GpsWatcherControl } from './controls/gpsWatchControl';
import { watchGPS, showCurrGPS, stopWatchGPS } from './gpsWatch';
import imgPos from './assets/pos.png';

const L = _();

let Watermark = L.Control.extend({
    onAdd: function(map: any) {
        var img = L.DomUtil.create('img');

        img.src = waterMarkPng;
        return img;
    },

    onRemove: function(map: any) {
        // Nothing to do here
    }
});

let presentationStarted: boolean = false;

const startPresentation = 'Запуск презентации';
const stopPresenttion = 'Остановить';

let Presentation = L.Control.extend({
    onAdd: function(map: any) {
        var button = L.DomUtil.create('button');
        button.innerHTML= startPresentation;
        button.onclick = () => {
            if (!presentationStarted)
                button.innerHTML = stopPresenttion;
            else
                button.innerHTML = startPresentation;                
            presentationStarted = !presentationStarted
            StartPresentation(map, presentationStarted).then(res => {
                button.innerHTML = startPresentation;
                presentationStarted = false;
            })
        }
        return button;
    },

    onRemove: function(map: any) {
        // Nothing to do here
    }
});


function createFind(map: any, className: string = '', panel: any) {
    const input = L.DomUtil.create('input' ,className, panel);
    input.size = 15;
    input.placeholder = 'Найти';
    input.onkeyup = (e: any) => {
        if (e.keyCode == 13) {
          const seesights: ShowPlacesList[] = FeaturesList.featuresList.findByGroupName('Достопримечательности на маршруте') as ShowPlacesList[];
          for (let i = 0; i < seesights.length; ++i) {
            const point: number = seesights[i].data.findIndex(d =>
                d.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
            if (point != -1) {
                const target: ShowPlacesListData = seesights[i].data[point];
                seesights[i].marksList[point].openPopup();
                map.flyTo(target.position, 7,{animate: true, duration: 4})      
                break; 
            }
          }
        }
    }
    return input;
}

function createGpsControlPlaceHolder(className: string = '', panel:any) {
    const ph = L.DomUtil.create('div' ,className, panel);
    return ph;
}

enum GpsWatchMode {
    none,
    show,
    watch
}

const myPosIcon = L.icon({
    iconUrl: imgPos,
    iconSize: [25,41],
    iconAnchor: [25, 20],
});
let myPositionMarker: any | undefined;

function positionToMap (map: any, positon: Position, panTo: boolean) {
    if (myPositionMarker == null)
        myPositionMarker = L.marker([positon.coords.latitude, positon.coords.longitude], {icon: myPosIcon}).addTo(map);
    else 
        myPositionMarker.setLatLng([positon.coords.latitude, positon.coords.longitude]);
    if (panTo)
        map.panTo([positon.coords.latitude, positon.coords.longitude], {animate: true})
};

let currentWatchMode: 0 | 1 | 2 = 0;
function onTriggerWatchGPSMode(map: any, gwm: GpsWatchMode) {
    if (currentWatchMode == gwm)
        return;
    currentWatchMode = gwm;
    renderGPSWatchControl(map);
    if (gwm == GpsWatchMode.watch)
        watchGPS((pos) => positionToMap(map, pos, true));
    else if (gwm == GpsWatchMode.show)
        watchGPS((pos) => positionToMap(map, pos, false));
    else
        clearWatch(map);
}

function clearWatch(map: any) {
    currentWatchMode = 0;
    stopWatchGPS();
    if (myPositionMarker) {
        myPositionMarker.remove();
        myPositionMarker = null;
    }
    renderGPSWatchControl(map);
}

let gpsControlPlaceHolder: any = undefined;


function renderGPSWatchControl(map: any) {
    if (gpsControlPlaceHolder) {
        ReactDOM.render(
            <GpsWatcherControl
                position={currentWatchMode}
                select={(watchMode: GpsWatchMode) => {
                    onTriggerWatchGPSMode(map, watchMode)
                }}
            />, gpsControlPlaceHolder);
    }

}

let emptyPanel = L.Control.extend({
    onAdd: (map: any) => {
        const panel = L.DomUtil.create('div', 'toolsPanel');
        panel.style.width = 50;
        panel.style.height = 50; 

        createFind(map, '', panel);
        gpsControlPlaceHolder = createGpsControlPlaceHolder('gpsControlPlaceHolder', panel);
        renderGPSWatchControl(map);
        return panel;
    },
    onRemove: function(map: any) {
        // Nothing to do here
    }
})

export function AddButtonsToTheMap(map: any) {
    new Watermark({ position: 'bottomleft' }).addTo(map);
    new Presentation({position: 'topleft'}).addTo(map);
    new emptyPanel({position: 'topleft'}).addTo(map);
}