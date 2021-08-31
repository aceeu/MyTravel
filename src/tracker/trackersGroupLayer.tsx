import { _ } from '../leaflet-define';
import { TrackFetch } from './trackFetch';

export function getTrackersLayer() {
    let trackersGroup = _().layerGroup();
    let track = new TrackFetch();
    trackersGroup.addLayer(track.getPolylines());
    trackersGroup.on('add', () => {
        console.log('on tracker add');
        track.startMonitoring();
    });
    trackersGroup.on('remove', () => {
        console.log('on tracker remove');
        track.stopMonitoring();
    });
    return trackersGroup;
}