import _ from './leaflet-define';
import { StartPresentation } from './presentation'
import imgUral from './assets/ural.png';
import { ShowPlacesList, ShowPlacesListData } from './features/show-places';
import { FeaturesList } from './features/features-list';

const L = _();

let Watermark = L.Control.extend({
    onAdd: function(map: any) {
        var img = L.DomUtil.create('img');

        img.src = imgUral;
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

let editCreator = L.Control.extend({
    onAdd: (map: any) => {
        let input = L.DomUtil.create('input');
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
    },
    onRemove: function(map: any) {
        // Nothing to do here
    }
})

export function AddButtonsToTheMap(map: any) {
    new Watermark({ position: 'bottomleft' }).addTo(map);
    new Presentation({position: 'topleft'}).addTo(map);
    new editCreator({position: 'topleft'}).addTo(map);
}