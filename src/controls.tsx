import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { _ } from './leaflet-define';
import { StartPresentation } from './presentation'
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';
import { FeaturesList } from './features/features-list';
import { GpsWatcherControl } from './controls/gpsWatchControl';
import posPng from './assets/pos.png';
import * as icons from './gen/sprites/icons';
import './gen/sprites/_icons.scss';
import { genKmlMainroute, genKmlAltRoutes } from './kmlgen';
import { config } from './config';

const L = _();

let watermark = L.Control.extend({
    onAdd: function(map: any) {
        var img = L.DomUtil.create('img');

        img.src = 'watermark.png';
        return img;
    },

    onRemove: function(map: any) {
        // Nothing to do here
    }
});

function presentationButton(opt: any) {
    let presentationStarted: boolean = false;

    const startPresentation = `<div class='${icons.info['information'].className}'
        style="width:37px;height:37px"></div>`;
    const stopPresenttion = 'Остановить';

    const presentationButtonImpl = L.Control.extend({
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
    return new presentationButtonImpl(opt);
}

const findControl = L.Control.extend({
    onAdd: (map: any) => {
        const input = L.DomUtil.create('input' ,'', undefined);
        input.size = 15;
        input.placeholder = 'Найти';
        input.onkeyup = (e: any) => {
            if (e.keyCode == 13) {
              const seesights: ShowPlacesList[] = FeaturesList.featuresList.findByGroupName('Достопримечательности') as ShowPlacesList[];
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
    },
    onRemove: () => {}
})

function gpsPosPanel(opt: any) {

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
        iconUrl: posPng,
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

    let watchPositionId: number | undefined;

    function watchGPS(fu: (pos: Position) => void) {
        stopWatchGPS();
        watchPositionId = navigator.geolocation.watchPosition(
        fu, 
        (positonError: PositionError) => {
            console.log(JSON.stringify(positonError));
        },
        {
            enableHighAccuracy: true
        });
    }

    function stopWatchGPS() {
        if (watchPositionId) {
            navigator.geolocation.clearWatch(watchPositionId);
            watchPositionId = undefined;
        }
    }

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

    let gpsPosPanelImpl = L.Control.extend({
        onAdd: (map: any) => {
            const panel = L.DomUtil.create('div', 'toolsPanel');
            panel.style.width = 50;
            panel.style.height = 50; 
            gpsControlPlaceHolder = createGpsControlPlaceHolder('gpsControlPlaceHolder', panel);
            renderGPSWatchControl(map);
            return panel;
        },
        onRemove: function(map: any) {
            // Nothing to do here
        }
    })
    return new gpsPosPanelImpl(opt);
}

function download(filename: string, text: string) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

const downloadButton = L.Control.extend({
    onAdd: function(map: any) {
        var button = L.DomUtil.create('button');
        button.innerHTML= "Загрузить трек";
        button.onclick = () => {
            download(`${config.kmlDefaultName}.kml`, genKmlMainroute(config.kmlDefaultName));
            download(`${config.kmlAlternatesName}.kml`, genKmlAltRoutes(config.kmlAlternatesName));
        };
        return button;
    },
    onRemove: function(map: any) {
        // Nothing to do here
    }
});


export default function controls(map: any) {
    new watermark({ position: 'bottomleft' }).addTo(map);
    presentationButton({position: 'topleft'}).addTo(map);
    gpsPosPanel({position: 'topleft'}).addTo(map);
    new findControl({position: 'bottomright'}).addTo(map);
    new downloadButton({positon: 'topleft'}).addTo(map);
}
