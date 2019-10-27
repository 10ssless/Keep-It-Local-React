import React from 'react';
import './Loading.css';

export default function Loading(props) {
    console.log(props);
    const { text, visible } = props;
    console.log(visible);
    console.log(visible ? 'visible' : 'none');
    return (
        // <div class="d-flex flex-column align-items-center justify-content-center"
        <div id="spinner-background" style={{visibility : visible ? 'visible' : 'hidden'}}>
            <div id="spinner-container" class="text-center">
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading</span>
                    </div>
                </div>
                <div class="text-center" id="loading-text">
                    <strong>{text}</strong>
                </div>
            </div>
        </div>
        // </div>
    )
}

Loading.defaultProps = {
    text: "Loading",
    visible: false
}
