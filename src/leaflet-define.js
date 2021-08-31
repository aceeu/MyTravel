import L from 'leaflet';

export function _() {
    return L;
};

export function LatLng(lat, lng, alt) {
    return new L.LatLng(lat, lng, alt);
}
