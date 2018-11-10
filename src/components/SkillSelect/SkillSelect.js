import React, { Component } from 'react';
import './SkillSelect.scss';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

class SkillSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: [],
    };
  }

  addSkill() {
    const skills = [...this.state.skills];
    const cur = this.newText.value;
    if (cur !== '' && !skills.includes(cur)) {
    	skills.push(cur);
    }
    this.setState({ skills }, () => this.props.updateSkills(skills));
    this.newText.value = '';
  }

  removeFromArray(arr) {
    let what; const a = arguments; let L = a.length; let
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  removeSkill(skill) {
  	const skills = this.state.skills;
    this.removeFromArray(skills, skill);
    this.setState({ skills }, () => this.props.updateSkills(skills));
  }

  render() {
    return (
      <div className="skill-select">
        <div>
          <input placeholder="enter skill (ex: Java)" type="text" ref={(ip) => { this.newText = ip; }} />
          <button className="add-button" onClick={this.addSkill.bind(this)}>Add</button>
        </div>
        <ul>
          {
          	this.state.skills.map(skill => (
            <li onClick={() => this.removeSkill(skill)}>
              { skill }
              {' '}
              <FaTimesCircle style={{ verticalAlign: 'text-top' }} />
            </li>
          	))
          }
        </ul>
      </div>
    );
  }
}

export default SkillSelect;
