import { Map } from './leafletMap'
import initSW from './service-worker-init'
import installPWA from './install-pwa-init';
import controls from './controls';
import features from './features-init';

export interface MapEntity {
    (m: Map): void
}
export const entities: MapEntity[] = [
    initSW,
    installPWA,
    controls,
    features,
]