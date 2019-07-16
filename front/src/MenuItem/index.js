import React from 'react';

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
    fetch(`https://resto-back.192.168.85.40.xip.io/worker/${this.props.queue}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
    });
  }

  render() {
    return (
      <li>
        <input
          type="number"
          min="1"
          value={this.state.count}
          onChange={this.handleChange}
        />
        <button onClick={this.handleClick}>
          { this.props.name }
        </button>
      </li>
    );
  }
}

export default MenuItem;
