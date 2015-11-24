import React from 'react';
import keys from 'lodash/object/keys';
import mapCollection from 'lodash/collection/map';

class HeaderColumnWrapper extends React.Component {
    render() {
        return <th>{this.props.column}</th>;
    }
}

class HeadListItemWrapper extends React.Component {
    render() {
        return <tr>{this.props.header.map((column, i) => <HeaderColumnWrapper key={i} column={column} />)}</tr>
    }
}

class ColumnWrapper extends React.Component {
    render() {
        return <td>{this.props.column}</td>;
    }
}

class ListItemWrapper extends React.Component {
    render() {
        return <tr>{mapCollection(this.props.row, (fieldValue, fieldName) => <ColumnWrapper key={fieldName} column={fieldValue} />)}</tr>
    }
}

class CSVPreview extends React.Component {

    render() {

        const header = keys(this.props.rows[0]);
        return (
            <table className="table table-striped table-bordered table-condensed">
                <thead>
                    {header ? <HeadListItemWrapper header={header} /> : ''}
                </thead>
                <tbody>
                    {this.props.rows.map((row, i) => <ListItemWrapper key={i} row={row} />)}
                </tbody>
            </table>
        );
    }

}

class EncodingSelector extends React.Component {
    onChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
                <div>
                    <span>Un problème avec l'affichage des caractères ? Essayez de lire le fichier avec un autre encodage :&nbsp;</span>
                    <select className="form-control form-inline" onChange={e => this.onChange(e)} value={this.props.encoding}>
                        <option value="utf-8">UTF-8</option>
                        <option value="iso-8859-1">ISO 8859-1 (Latin-1)</option>
                        <option value="iso-8859-15">ISO 8859-15 (Latin-9)</option>
                        <option value="windows-1252">ANSI (Windows)</option>
                    </select>
                </div>
        );
    }
}

export default class CSVViewer extends React.Component {

    render() {
        return (
            <div>
                <h2>2. Aperçu des données et vérification</h2>
                <CSVPreview rows={this.props.csvRows} />
                <EncodingSelector encoding={this.props.encoding} onChange={encoding => this.props.onEncodingChange(encoding)} />
            </div>
        );
    }

}
