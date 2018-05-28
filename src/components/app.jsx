import React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from '../redux/reducers.js'
const store = createStore(reducers)

import IPCH from './ipc-handler'
import Editor from './editor/editor'

class App extends React.Component {
    componentDidMount() {
        vex.dialog.buttons.YES.text = store.getState().lang.buttons.confirm
        vex.dialog.buttons.NO.text = store.getState().lang.buttons.cancel
    }

    render() {
        return (
            <Provider store={store}>
                <div>
                    <IPCH/>
                    <Editor/>
                </div>
            </Provider>
        );
    }
}

export default App;