import React from 'react';
import './style.css';

/**
 * Needs all these properties:
 *  - status: worker status got from /status request to the backend
 *  - time: manually enter the time interval for the worker
 */
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
            min={this.props.status.hpa.minReplicas},
            max={this.props.status.hpa.maxReplicas},
            target={this.props.status.hpa.target},
            current={this.props.status.hpa.currentReplicas},
            desired={this.props.status.hpa.desiredReplicas}
        </p>
      </React.Fragment>
    );
  }
}

export default WorkerStatus;
