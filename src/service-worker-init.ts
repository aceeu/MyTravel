
export default function initSW(map: any): void {
    initServiceWorker()
}

function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(location.href + 'service-worker.js')
            .then(reg => console.log('registration successful, scope is:'+ reg.scope))
            .catch(err => console.log('service worker registration failed: ' + err))
    }
}
