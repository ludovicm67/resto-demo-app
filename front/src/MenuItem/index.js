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
      number: 1,
    };
  }

  render() {
    return (
      <div>
        <input type="number" min="1" value={this.state.number}></input>
        <button>{ this.props.name }</button>
      </div>
    );
  }
}

export default MenuItem;
