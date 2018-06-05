/*
 * Copyright 2017 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'babel-polyfill'

// import 'assets/bootstrap/css/custom/bootstrap.css'
import 'assets/bootstrap/js/bootstrap.js'
import 'assets/font-awesome/css/font-awesome.css'
import 'assets/umy-font/umy-font.css'
import 'assets/app/css/umyproto.deskpage.css'
import './app.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducer from 'redux/reducer.js'
import mainSaga from 'sagas/saga.js'
import myMiddleware from 'redux/middleware.js'
import { handleCompilerMessage } from 'modules/app/containers/AppContainer/actions.js'

import { MainFrame } from 'components/index'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(myMiddleware, sagaMiddleware, thunk)
)
sagaMiddleware.run(mainSaga)
const { protocol, hostname, port } = window.location
const socket = io.connect(protocol + '//' + hostname + ':' + port)
socket.on('invitation', message => console.log(message))
socket.on('compiler.message', stats => {
  // console.log('compiler.message: ' + JSON.stringify(stats));
  store.dispatch(handleCompilerMessage(stats))
})

//window.onbeforeunload = function(e) {
//    store.dispatch(saveModel());
//};

ReactDOM.render(
  <Provider store={store}>
    <MainFrame />
  </Provider>,
  document.getElementById('content')
)
