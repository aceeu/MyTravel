import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface PWAPromoProps {
    on: (value: boolean) => void;
}

export const PWAPromo = (props: PWAPromoProps) => {
    return (
        <div id='pwa-promo'>
            <button
                onClick={() => props.on(true)}
            >
                Установить
            </button>
            <button
                onClick={() => props.on(false)}
            >
                Скрыть
            </button>
        </div>
    )
}