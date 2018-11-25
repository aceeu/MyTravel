import * as React from 'react';
import './controls.css';

export interface ShowPlaceboardProps {
    name: string;
    position: number[]; // lat, lng
    imageUrl?: string;
    youtube?: string;
    text?: string;
    hrefs: string[];
}

export const ShowPlaceboard: React.SFC<ShowPlaceboardProps> = (props: ShowPlaceboardProps) => {
    const links = props.hrefs.map((l, i) => (<a href={l} key={i}>ссылка</a>))
    const youtube = props.youtube && <iframe width="336" height="189" 
        src={props.youtube}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
    >;
    </iframe>;
    const img = props.imageUrl ? 
        <img
            src={props.imageUrl}
            className='showPlaceBoardImage'
        ></img> : null;
    return (
        <div className='showPlaceBoard'>
            <h3>{props.name}</h3>
            <div>{`${props.position[0]}, ${props.position[1]}`}</div>
            {img}
            {youtube}
            <div>{props.text}</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>{links}</div>
        </div>
    );
}
