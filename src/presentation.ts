import { FeaturesList } from './features/features-list'
import { ShowPlacesList } from 'features/show-places';


export function StartPresentation(map: any) {
    const seesights: ShowPlacesList = FeaturesList.featuresList.find('Достопримечательности') as ShowPlacesList;
    let i = 0;
    setInterval(
        () => {
            seesights.marksList[i].openPopup();
            map.flyTo(seesights.data[i++].position, 7,{animate: false, duration: 5})
        }, 5000);
}