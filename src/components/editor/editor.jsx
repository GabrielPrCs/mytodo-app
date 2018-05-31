import React from 'react'

import ListPanel from './list-panel/list-panel'
import AddPanel from './add-panel/add-panel'
import Tabs from './tabs/tabs'

export default () => {
    return (
        <div id="editor-window">
            <Tabs/>
            <ListPanel/>
            <AddPanel/>
        </div>        
    );
}