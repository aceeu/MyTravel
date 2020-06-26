
let watchPositionId: number | undefined;

export function watchGPS(fu: (pos: Position) => void) {
    watchPositionId = navigator.geolocation.watchPosition(
    fu, 
    (positonError: PositionError) => {
        console.log(JSON.stringify(positonError));
    },
    {
        enableHighAccuracy: true
    });
}

export function showCurrGPS(fu: (pos: Position) => void) {
    
    navigator.geolocation.getCurrentPosition(
        fu, 
        (positonError: PositionError) => {
            console.log(JSON.stringify(positonError));
        },
        {
            enableHighAccuracy: true
        }
    )
}

export function stopWatchGPS() {
    if (watchPositionId) {
        navigator.geolocation.clearWatch(watchPositionId);
        watchPositionId = undefined;
    }
}