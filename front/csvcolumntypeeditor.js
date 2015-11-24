import React from 'react';
import collectionMap from 'lodash/collection/map';

class ColumnWrapper extends React.Component {

    onTypeChange(event) {
        this.props.onTypeChange(event.target.value);
    }

    renderValidation() {
        if (! this.props.type) return '';
        const errorCount = this.props.columnErrors ? this.props.columnErrors.length : 0;
        return <span>{errorCount} erreur(s)</span>;
    }

    hasType() {
        return !!this.props.type;
    }

    errorCount() {
        return (this.hasType() && this.props.columnErrors && this.props.columnErrors.length) || 0;
    }

    validationState() {
        return this.hasType() && (this.errorCount() > 0 ? 'warning' : 'success');
    }

    render() {
        return (
            <tr className={this.validationState()}>
                <td>{this.props.column}</td>
                <td>
                    <select onChange={e => this.onTypeChange(e)} className="form-control" value={this.props.type || 'nonDefini'}>
                        <option value="nonDefini">-- Non défini --</option>
                        {collectionMap(this.props.selectableFields, (option, key) => <option value={key} key={key}>{option.label}</option>)}
                    </select>
                </td>
                <td></td>
                <td>{ this.renderValidation() }</td>
            </tr>
        );
    }
}

export default class CSVColumnTypeEditor extends React.Component {

    onTypeChange(column, newType) {
        this.props.onTypeChange(column, newType);
    }

    /* Render */
    render() {
        return (
            <div>
                <h2>3. Qualification des colonnes</h2>
                <table className="table table-bordered table-striped ">
                    <thead>
                        <tr>
                            <th>Nom de la colonne</th>
                            <th>Champ associé</th>
                            <th>Paramètres additionnels</th>
                            <th>Validation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.columns.map((column, i) => <ColumnWrapper type={this.props.selectedTypes[column]} onTypeChange={newType => this.onTypeChange(column, newType)} selectableFields={this.props.selectableFields} column={column} columnErrors={this.props.columnErrors[column]} key={i} />)}
                    </tbody>
                </table>
            </div>
        );
    }

}
