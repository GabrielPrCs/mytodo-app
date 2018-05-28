import React from 'react'

import Header from './partials/_header'
import Body from './partials/_body'


export default () => {
    return (
        <div className="list-panel">
            <table>
                <Header/>
                <Body/>
            </table>
        </div>
    );
}