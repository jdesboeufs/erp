import React from 'react';

export default class CSVDrop extends React.Component {

    /* Logic */
    preventDefault(event) {
        event.preventDefault();
    }

    drop(event) {
        event.preventDefault();
        if (! event.dataTransfer.files.length) return;
        this.props.onFile(event.dataTransfer.files[0]);
    }

    /* Render */
    render() {
        return (
            <div>
                <h2>1. Choix du fichier</h2>
                <div style={{ height: '200px', background: '#ffaaaa' }} onDragOver={this.preventDefault} onDrop={e => this.drop(e)}>
                </div>
            </div>
        );
    }

}
