import _ from './leaflet-define';
import { StartPresentation } from './presentation'

const L = _();

L.Control.Watermark = L.Control.extend({
    onAdd: function(map: any) {
        var img = L.DomUtil.create('img');

        img.src = 'https://i.ibb.co/TYZrzxq/image.png';
        img.style.width = '200px';

        return img;
    },

    onRemove: function(map: any) {
        // Nothing to do here
    }
});

let presentationStarted: boolean = false;

const startPresentation = 'Запуск презентации';
const stopPresenttion = 'Остановить';

L.Control.Button = L.Control.extend({
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

export function AddButtonsToTheMap(map: any) {

    L.control.watermark = function(opts: any) {
        return new L.Control.Watermark(opts);
    }
    L.control.button = function(opts: any) {
        return new L.Control.Button(opts);
    }

    L.control.watermark({ position: 'bottomleft' }).addTo(map);
    L.control.button({position: 'topleft'}).addTo(map);
}