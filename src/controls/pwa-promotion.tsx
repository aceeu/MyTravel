import * as React from 'react'

interface PWAPromoProps {
    on: (value: boolean) => void;
}

export const PWAPromo = (props: PWAPromoProps) => {
    return (
        <div id='pwa-promo'>
            <button
                onClick={() => props.on(true)}
            >
                Добавить на рабочий стол
            </button>
            <button
                onClick={() => props.on(false)}
            >
                Скрыть
            </button>
        </div>
    )
}