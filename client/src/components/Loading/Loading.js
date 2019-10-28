import React from 'react';
import './Loading.css';

export default function Loading(props) {
    console.log(props);
    const { text, visible } = props;
    console.log(visible);
    console.log(visible ? 'visible' : 'none');
    return (
        <div id="spinner-background" style={{ visibility: visible ? 'visible' : 'hidden' }}>
            <div id="spinner-container" className="text-center">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">locating events near you...</span>
                    </div>
                </div>
                <div className="text-center" id="loading-text">
                    <strong>{text}</strong>
                </div>
            </div>
        </div>
    )
}

Loading.defaultProps = {
    text: "Loading",
    visible: false
}
