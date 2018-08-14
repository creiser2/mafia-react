import React, {Component} from 'react';

function withWaiting(WrappedComponent) {
  return class extends Component {
    state = { loading: true }

    componentDidMount() {
      setTimeout(() => this.setState({ loading: false }), 5000)
    }

    render() {
      if (this.state.loading) {
        return <p>Loading</p>
      } else {
        return <WrappedComponent {...this.props} />
      }
    }
  }
}

export default withWaiting;
