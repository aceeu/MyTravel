import * as React from 'react';
import './controls.css';

const lefts = [5, 30, 55];
const borders = [25, 50];

interface Props {
    position: 0 | 1 | 2;
    select?: (position: number) => void;
}
export const GpsWatcherControl: React.SFC<Props> = (props) => {
    const left = lefts[props.position % 3];
    const element = React.createRef<HTMLDivElement>();
    const click = (event: any) => {
        const rc = element?.current && element.current.getBoundingClientRect();
        const xpos = rc ? event.clientX - rc?.left : 0;
        if (props.select) {
            if (xpos < borders[0])
                props.select(0);
            else
                props.select(xpos < borders [1] ? 1 : 2);
        }
    }
    return (
        <div 
            className='gpsWatcherControl'
            onClick={click}
            ref={element}
        >
            <div
                className='gpsWatcherSelector'
                style={{left}}
            ></div>
        </div>
    );
}