import React from 'react';
import ReactDOM from 'react-dom';
import Papa from 'papaparse';
import CSVDrop from './csvdrop';
import CSVViewer from './csvviewer';
import CSVColumnTypeEditor from './csvcolumntypeeditor';
import update from 'react-addons-update';
import collectionForEach from 'lodash/collection/forEach';
import collectionIncludes from 'lodash/collection/includes';

export default class CSVImporter extends React.Component {

    /* Logic */
    constructor() {
        super();
        this.state = {
            currentFile: null,
            lines: null,
            fileReady: false,
            encoding: 'utf-8',
            selectedTypes: {},
            columnErrors: {}
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
                validate: val => collectionIncludes([1, 2, 3, 4, 5], val)
            }
        }
    }

    previewFile() {
        Papa.parse(this.state.currentFile, {
            preview: 9,
            complete: (results) => this.setState({ rows: results.data, fields: results.meta.fields, fileReady: true }),
            encoding: this.state.encoding,
            header: true
        });
    }

    validateFile() {
        const columnErrors = {};
        let rowCounter = 1;
        Papa.parse(this.state.currentFile, {
            step: (results) => {
                rowCounter++;
                collectionForEach(results.data[0], (fieldValue, fieldName) => {
                    if (fieldName in this.state.selectedTypes) {
                        const currentType = this.selectableFields[this.state.selectedTypes[fieldName]];
                        if (!currentType) return;
                        if (currentType.validate) {
                            const value = currentType.transform ? currentType.transform(fieldValue) : fieldValue;
                            if (! currentType.validate(value)) {
                                const error = {
                                    type: 'ValidationError',
                                    fieldName,
                                    selectedType: currentType.label,
                                    originalValue: fieldValue,
                                    transformedValue: value,
                                    row: results.data[0],
                                    rowNumber: rowCounter
                                };
                                if (!(fieldName in columnErrors)) {
                                    columnErrors[fieldName] = [];
                                }
                                columnErrors[fieldName].push(error);
                            }
                        }
                    }
                });
            },
            complete: () => {
                this.setState({ columnErrors });
            },
            encoding: this.state.encoding,
            header: true
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
        this.setState({ selectedTypes: update(this.state.selectedTypes, { $merge: obj }) }, () => this.validateFile());
    }

    /* Render */
    render() {
        return (
            <div>
                <h1>Importer des ERP à partir d'un fichier CSV</h1>
                <CSVDrop onFile={file => this.onDropFile(file)} />
                { this.state.fileReady ? <CSVViewer encoding={this.state.encoding} onEncodingChange={encoding => this.onEncodingChange(encoding)} csvRows={this.state.rows} /> : ''}
                { this.state.fileReady ?
                    <CSVColumnTypeEditor
                        onTypeChange={(column, newType) => this.onTypeChange(column, newType)}
                        selectedTypes={this.state.selectedTypes}
                        selectableFields={this.selectableFields}
                        columns={this.state.fields}
                        columnErrors={this.state.columnErrors} />
                    : ''
                }
            </div>
        );
    }

}
