import React, {Component} from 'react';
import Loading from 'react-loading-bar'

function withWaiting(WrappedComponent) {
  return class extends Component {
    state = { loading: true }

    componentDidMount() {
      setTimeout(() => this.setState({ loading: false }), 5000)
    }

    render() {
      if (this.state.loading) {
        return (
          <div className = 'gutter mxa py1 border-red abs fill ac money-bags'>
            <div className = 'bg-black money-green f jcc'>
              <h2 className='mafia-font'>loading...</h2>
            </div>
            <div className = "p1 bg-black money-green mb2 bottom rel mxa mw-10 br10 top-600">
              <h2>Player: {this.props.username}</h2>
            </div>
          </div>
        )

      } else {
        return <WrappedComponent {...this.props} />
      }
    }
  }
}

export default withWaiting;
