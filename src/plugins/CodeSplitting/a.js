// import { start } from '@xmly/award';
import React from 'react';
// import {
//   RouterSwitch,
//   Route,
//   Link,
//   beforeRoute,
//   afterRoute,
//   NavLink,
// } from '@xmly/award-router';

import Home from './b';
import Detail from './b';

// beforeRoute(({ routes }) => {
//   console.log('before', routes);
// });

// afterRoute((routes) => {
//   console.log('after', routes);
// });

const App = () => {
  return (
    <div>
      <h1>hello Award2</h1>
      <NavLink to="/">-----</NavLink>
      <br />
      <NavLink to="/home">home</NavLink>
      <br />
      <Link to="/detail">detail</Link>
      <RouterSwitch>
        <Route
          path="/home"
          component={Home}
          loading={() => <p>loading。。。。</p>}
        />
        <Route path="/detail/:id?" component={() => <h1>222</h1>} />
      </RouterSwitch>
    </div>
  );
};

// start(App);
