import React from 'react';
import collectionMap from 'lodash/collection/map';

class ColumnWrapper extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.column}</td>
                <td>
                    <select className="form-control">
                        <option value="nonDefini">-- Non défini --</option>
                        {collectionMap(this.props.selectableFields, (option, key) => <option value={key} key={key}>{option.label}</option>)}
                    </select>
                </td>
                <td></td>
            </tr>
        );
    }
}

export default class CSVColumnTypeEditor extends React.Component {

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
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.columns.map((column, i) => <ColumnWrapper selectableFields={this.props.selectableFields} column={column} key={i} />)}
                    </tbody>
                </table>
            </div>
        );
    }

}
