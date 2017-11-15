import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  toggleTimer,
  incrementTimer,
} from '../../modules/timer'

const Home = props => (
  <div>
    <h1>Home</h1>
    <Timer isActive={props.isActive} secondsElapsed={props.secondsElapsed} onTick={props.incrementTimer}/>
    <p>Active: {props.isActive ? 'YES' : 'NO'}</p>

    <p>
      <button onClick={props.toggleTimer}>Toggle</button>
    </p>

    <p><button onClick={() => props.changePage()}>Go to about page via redux</button></p>
  </div>
)

function Timer(props) {
  if (props.isActive) {
    return <ActiveTimer onTick={props.onTick} display={props.secondsElapsed}/>
  }
  return <DeactiveTimer display={props.secondsElapsed}/>
}

class ActiveTimer extends React.Component {
  state = {
    timer: null
  }

  componentDidMount() {
    let timer = setInterval(this.props.onTick, 1000);
    this.setState({timer})
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    return (
      <div>
        <h1>{this.props.display} - Running</h1>
      </div>
    )
  }
}

function DeactiveTimer(props) {
  return (
    <div>
      <h1>{props.display} - Stopped</h1>
    </div>
  )
}

const mapStateToProps = state => ({
  secondsElapsed: state.timer.secondsElapsed,
  isActive: state.timer.isActive,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTimer,
  incrementTimer,
  changePage: () => push('/about-us')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)