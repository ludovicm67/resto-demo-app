import React from 'react';
import config from '../config';
import './style.css';

/**
 * Needs all these properties:
 *  - name: name of the item
 *  - queue: queue name
 */
class MenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      count: 1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({
      count: event.target.value,
    });
  }

  handleClick(_event) {
    fetch(`${config.backend}/worker/${this.props.queue}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
    });
  }

  render() {
    return (
      <li className="menu-item">
        <input
          className="menu-item-count"
          type="number"
          min="1"
          value={this.state.count}
          onChange={this.handleChange}
        />
        <span>×</span>
        <button
          className="menu-item-button"
          onClick={this.handleClick}
        >
          { this.props.name }
        </button>
      </li>
    );
  }
}

export default MenuItem;
