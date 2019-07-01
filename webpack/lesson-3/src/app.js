import React from 'react';
import Loadable from 'react-loadable';
import CountB from './components/countB';

const LoadableComponent = Loadable({
  loader: () => import('./components/countA.js'),
  loading: () => <p>加载中...</p>,
  delay: 3000,
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      component: () => null,
    };
  }

  componentDidMount() {
    // import('./components/countA').then((component) => {
    //   this.setState({
    //     component: component.default || component,
    //   });
    // });
  }

  render() {
    const Component = this.state.component;
    return (
      <React.Fragment>
        <h1>hello world</h1>
        <LoadableComponent />
        <p>b------------------b</p>
        <CountB />
      </React.Fragment>
    );
  }
}

global.start(App);
