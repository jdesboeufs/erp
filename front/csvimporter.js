import React from 'react';
import ReactDOM from 'react-dom';
import Papa from 'papaparse';
import CSVDrop from './csvdrop';
import CSVViewer from './csvviewer';
import CSVColumnTypeEditor from './csvcolumntypeeditor';

export default class CSVImporter extends React.Component {

    /* Logic */
    constructor() {
        super();
        this.state = {
            currentFile: null,
            lines: null,
            fileReady: false,
            encoding: 'utf-8'
        };
        this.encodingList = ['utf-8', 'iso-8859-1', 'windows-1252'];
        this.selectableFields = {
            codeInsee: { label: 'Adresse : code INSEE' },
            codePostal: { label: 'Adresse : code postal' },
            numeroVoie: { label: 'Adresse : numéro de voie' },
            nomVoie: { label: 'Adresse : nom de la voie' },
            voieComplete: { label: 'Adresse : numéro de voie + nom' },
            nomCommune: { label: 'Adresse : nom de la commune' },
            adresseComplete: { label: 'Adresse complète' },
            nom: { label: 'Nom de l\'établissement' },
            categorie: { label: 'Catégorie de l\'établissement' }
        }
    }

    parseFile() {
        Papa.parse(this.state.currentFile, {
            preview: 9,
            complete: (results) => this.setState({ lines: results.data, fileReady: true }),
            encoding: this.state.encoding
        });
    }

    onEncodingChange(encoding) {
        this.setState({ encoding }, () => this.parseFile());
    }

    onDropFile(file) {
        this.setState({ currentFile: file }, () => this.parseFile());
    }

    /* Render */
    render() {
        return (
            <div>
                <h1>Importer des ERP à partir d'un fichier CSV</h1>
                <CSVDrop onFile={file => this.onDropFile(file)} />
                { this.state.fileReady ? <CSVViewer encoding={this.state.encoding} onEncodingChange={encoding => this.onEncodingChange(encoding)} csvRows={this.state.lines} csvHasHeader={true} /> : ''}
                { this.state.fileReady ? <CSVColumnTypeEditor selectableFields={this.selectableFields} columns={this.state.lines[0]} /> : ''}
            </div>
        );
    }

}
