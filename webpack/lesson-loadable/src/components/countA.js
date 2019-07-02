import React from 'react';
import { hot } from 'react-hot-loader';

class App extends React.Component {
  constructor() {
    super();
    console.log('1');
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    console.log('did');
  }

  render() {
    console.log('2');
    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              count: this.state.count + 1,
            });
          }}
        >
          点击+
        </button>
        &nbsp;
        <button
          onClick={() => {
            this.setState({
              count: this.state.count - 1,
            });
          }}
        >
          点击-
        </button>
        <p>count222: {this.state.count}</p>
      </div>
    );
  }
}

export default hot(module)(App);
