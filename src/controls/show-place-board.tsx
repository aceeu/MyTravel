import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './controls.css';

export interface ShowPlaceboardProps {
    name: string;
    position: number[]; // lat, lng
    imageUrl: string;
    text?: string;
    href: string;
}

export const ShowPlaceboard: React.SFC<ShowPlaceboardProps> = (props: ShowPlaceboardProps) => {
    return (
        <div className='showPlaceBoard'>
            <div>{props.name}</div>
            <div>{`${props.position[0]}, ${props.position[1]}`}</div>
            <img 
                src={props.imageUrl}
                className='showPlaceBoardImage'
            ></img>
            <div>{props.text}</div>
            <a href={props.href}>ссылка</a>
        </div>
    );
}
