import React from 'react';

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
        return <tr>{this.props.row.map((column, i) => <ColumnWrapper key={i} column={column} />)}</tr>
    }
}

class CSVPreview extends React.Component {

    render() {
        let header;
        let rows = this.props.rows;
        if (this.props.hasHeader) {
            header = rows[0];
            rows = rows.slice(1);
        }
        return (
            <table className="table table-striped table-bordered table-condensed">
                <thead>
                    {header ? <HeadListItemWrapper header={header} /> : ''}
                </thead>
                <tbody>
                    {rows.map((row, i) => <ListItemWrapper key={i} row={row} />)}
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
                        <option value="iso-8859-1">Latin-1</option>
                        <option value="windows-1252">Windows</option>
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
                <CSVPreview hasHeader={this.props.csvHasHeader} rows={this.props.csvRows} />
                <EncodingSelector encoding={this.props.encoding} onChange={encoding => this.props.onEncodingChange(encoding)} />
            </div>
        );
    }

}
