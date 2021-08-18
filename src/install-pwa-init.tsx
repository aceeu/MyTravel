import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PWAPromo } from './controls/pwa-promotion';

export default function installPWA() {
    if (document.location.protocol == 'http:' && document.location.hostname != 'localhost') {
        document.location.assign('https://' + document.location.hostname + ':8079' + document.location.pathname);
        return;
    }
    // https://web.dev/customize-install/#criteria
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        let header = document.getElementById('header');
        if (header) {
            ReactDOM.render(
                <PWAPromo
                    on={(res: boolean) => {
                        header!.style.display='none';
                        if (res) {
                            deferredPrompt.prompt();
                            deferredPrompt.userChoice.then((choiceResult: any) => {
                                if (choiceResult.outcome === 'accepted') {
                                  fetch('/crimea20r');
                                } else {
                                  console.log('User dismissed the install prompt');
                                }
                            })
                        }
                    }}
                />, header
            );
        }
    });
}
