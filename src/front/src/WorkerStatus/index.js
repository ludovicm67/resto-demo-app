import React from 'react';
import './style.css';

class WorkerStatus extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p className="worker-status">
          Value:
            local={this.props.status.value},
            k8s_api={this.props.status.hpa.currentValue}
          (time: {this.props.time}s)
        </p>
        <p className="worker-status">
          HPA:
            min={this.props.min},
            max={this.props.max},
            target={this.props.target},
            current={this.props.status.hpa.currentReplicas},
            desired={this.props.status.hpa.desiredReplicas}
        </p>
      </React.Fragment>
    );
  }
}

export default WorkerStatus;
