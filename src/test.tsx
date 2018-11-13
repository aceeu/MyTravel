import * as React from 'react';
import './assets/main.css';


interface Props {
    text: string;
}

export class Hello extends React.PureComponent<Props> {
    render() {
        return (
            <div
                className={'red'}
            >
                {this.props.text}
            </div>
        );
    }
}


