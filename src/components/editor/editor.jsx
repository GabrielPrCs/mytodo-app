import React from 'react'

import ListPanel from './list-panel/list-panel'
import AddPanel from './add-panel/add-panel'
import Filter from './filter/filter'

export default () => {
    return (
        <div id="editor-window">
            <Filter/>
            <ListPanel/>
            <AddPanel/>
        </div>        
    );
}