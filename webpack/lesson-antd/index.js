import ReactDOM from 'react-dom';
import React from 'react';
import './index.less';
import 'antd/dist/antd.less';
import Detail from './detail';

const App = () => {
  return (
    <div>
      <h1>hello world</h1>
      <Detail />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
