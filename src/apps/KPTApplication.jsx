import React from 'react';
import PropTypes from 'prop-types';
import Yaml from 'js-yaml';
import isEqual from 'lodash/isEqual';

class KPTModel {
  constructor() {
    this.keeps = [];
    this.problems = [];
    this.tries = [];
  }
  addKeep(str) {
    this.keeps.push(str);
  }
  addProblem(str) {
    this.problems.push(str);
  }
  addTry(str) {
    this.tries.push(str);
  }
  equals(other) {
    return isEqual(this, other);
  }
  serialize() {
    return Yaml.safeDump(this);
  }
  static deserialize(str) {
    try {
      const obj = Yaml.safeLoad(str);
      const model = new KPTModel();
      if (obj.keeps) model.keeps = obj.keeps;
      if (obj.problems) model.problems = obj.problems;
      if (obj.tries) model.tries = obj.tries;
      return model;
    } catch (ex) {
      return new KPTModel();
    }
  }
}

const cellStyle = {
  border: '1px solid grey',
  verticalAlign: 'top',
};

export default class KPTApplication extends React.Component {
  constructor(props) {
    super();
    this.handleAddKeep = this.handleAddKeep.bind(this);
    this.handleAddProblem = this.handleAddProblem.bind(this);
    this.handleAddTry = this.handleAddTry.bind(this);
    this.state = { kpt: KPTModel.deserialize(props.data) };
  }
  componentWillReceiveProps(newProps) {
    if (this.props.data !== newProps.data) {
      const kpt = KPTModel.deserialize(newProps.data);
      this.setState({ kpt });
    }
  }
  shouldComponentUpdate(newProps, nextState) {
    return !this.state.kpt.equals(nextState.kpt);
  }
  handleAddKeep() {
    const { value } = this.inputKeep;
    if (!value) return;
    this.state.kpt.addKeep(value);
    this.forceUpdate();
    this.props.onEdit(this.state.kpt.serialize(), this.props.appContext);
  }
  handleAddProblem() {
    const { value } = this.inputProblem;
    if (!value) return;
    this.state.kpt.addProblem(value);
    this.forceUpdate();
    this.props.onEdit(this.state.kpt.serialize(), this.props.appContext);
  }
  handleAddTry() {
    const { value } = this.inputTry;
    if (!value) return;
    this.state.kpt.addTry(value);
    this.forceUpdate();
    this.props.onEdit(this.state.kpt.serialize(), this.props.appContext);
  }
  renderCell(title, items, handlerAdd, rowSpan = 1) {
    return (
      <td rowSpan={rowSpan} style={cellStyle}>
        <h2>{title}</h2>
        <ul>
          {items.map(s => (<li>{s}</li>))}
          <li key="input">
            <input ref={(c) => { this[`input${title}`] = c; }} type="text" placeholder={`Add ${title}`} />
            <input type="button" value="Add" onClick={handlerAdd} />
          </li>
        </ul>
      </td>);
  }
  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              {this.renderCell('Keep', this.state.kpt.keeps, this.handleAddKeep)}
              {this.renderCell('Try', this.state.kpt.tries, this.handleAddTry, 2)}
            </tr>
            <tr>
              {this.renderCell('Problem', this.state.kpt.problems, this.handleAddProblem)}
            </tr>
          </tbody>
        </table>
      </div>);
  }
}

KPTApplication.Model = KPTModel;

KPTApplication.propTypes = {
  data: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  appContext: PropTypes.shape({}).isRequired,
};
