import { FeaturesList } from './features/features-list'
import { ShowPlacesList, ShowPlacesListData } from 'features/show-places';

interface SeeSightsPair {
    data: ShowPlacesListData;
    mark: any;
}

let setIntervalId: NodeJS.Timeout;
export function StartPresentation(map: any, startStop: boolean): Promise<void> {
    if (startStop == false) {
        clearInterval(setIntervalId);
        return Promise.resolve();
    }
    
    return new Promise<void>((res, rej) => {
        const seesights: ShowPlacesList = FeaturesList.featuresList.find(
            ['Достопримечательности на маршруте']) as ShowPlacesList;
        let SeeSpairs: SeeSightsPair[] = [];
        for(let i: number = 0; i < seesights.data.length; ++i) {
            SeeSpairs.push({data: seesights.data[i], mark: seesights.marksList[i]});
        }
        SeeSpairs = SeeSpairs.filter((s: SeeSightsPair) => s.data.gravity >= 3);
        let i = 0;
        const handler = () => {
            SeeSpairs[i].mark.openPopup();
            let position = SeeSpairs[i++].data.position;
            position[0] += 1.5;
            map.flyTo(position, 7,{animate: true, duration: 4})
            if (i >= SeeSpairs.length) {
                clearInterval(setIntervalId);
                res();
            }
        };
        setImmediate(handler);
        setIntervalId = setInterval(
            handler, 7000);
    });

}