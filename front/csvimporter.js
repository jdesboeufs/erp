import React from 'react';
import ReactDOM from 'react-dom';
import Papa from 'papaparse';
import CSVDrop from './csvdrop';
import CSVViewer from './csvviewer';
import CSVColumnTypeEditor from './csvcolumntypeeditor';
import update from 'react-addons-update';

export default class CSVImporter extends React.Component {

    /* Logic */
    constructor() {
        super();
        this.state = {
            currentFile: null,
            lines: null,
            fileReady: false,
            encoding: 'utf-8',
            selectedTypes: {}
        };
        this.encodingList = ['utf-8', 'iso-8859-1', 'iso-8859-15'];
        this.selectableFields = {
            codeInsee: { label: 'Adresse : code INSEE' },
            codePostal: { label: 'Adresse : code postal' },
            numeroVoie: { label: 'Adresse : numéro de voie' },
            nomVoie: { label: 'Adresse : nom de la voie' },
            voieComplete: { label: 'Adresse : numéro de voie + nom' },
            nomCommune: { label: 'Adresse : nom de la commune' },
            adresseComplete: { label: 'Adresse complète' },
            nom: { label: 'Nom de l\'établissement' },
            categorie: {
                label: 'Catégorie de l\'établissement',
                transform: val => parseInt(val),
                validate: val => [1, 2, 3, 4, 5].includes(val)
            }
        }
    }

    previewFile() {
        Papa.parse(this.state.currentFile, {
            preview: 9,
            complete: (results) => this.setState({ lines: results.data, fileReady: true }),
            encoding: this.state.encoding
        });
    }

    onEncodingChange(encoding) {
        this.setState({ encoding }, () => this.previewFile());
    }

    onDropFile(file) {
        this.setState({ currentFile: file }, () => this.previewFile());
    }

    onTypeChange(column, newType) {
        const obj = {};
        obj[column] = newType;
        this.setState({ selectedTypes: update(this.state.selectedTypes, { $merge: obj }) });
    }

    /* Render */
    render() {
        return (
            <div>
                <h1>Importer des ERP à partir d'un fichier CSV</h1>
                <CSVDrop onFile={file => this.onDropFile(file)} />
                { this.state.fileReady ? <CSVViewer encoding={this.state.encoding} onEncodingChange={encoding => this.onEncodingChange(encoding)} csvRows={this.state.lines} csvHasHeader={true} /> : ''}
                { this.state.fileReady ? <CSVColumnTypeEditor onTypeChange={(column, newType) => this.onTypeChange(column, newType)} selectedTypes={this.state.selectedTypes} selectableFields={this.selectableFields} columns={this.state.lines[0]} /> : ''}
            </div>
        );
    }

}
