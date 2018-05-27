import React from 'react';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from '../redux/reducers.js'
const store = createStore(reducers)

import Filter from './partials/_filter.jsx'
import ListPanel from './partials/_list-panel.jsx'
import AddPanel from './partials/_add-panel.jsx'

class App extends React.Component {
    componentDidMount() {
        vex.dialog.buttons.YES.text = store.getState().lang.buttons.confirm
        vex.dialog.buttons.NO.text = store.getState().lang.buttons.cancel
    }

    render() {
        return (
            <Provider store={store}>
                <div id="editor-window">
                    <Filter/>
                    <ListPanel/>  
                    <AddPanel/>
                </div>
            </Provider>
        );
    }
}

export default App;