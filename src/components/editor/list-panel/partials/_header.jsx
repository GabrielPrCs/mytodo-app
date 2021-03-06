import React from 'react'
import { connect } from 'react-redux'
import { sortFile } from '../../../../redux/actions.js'

import Filter from './_filter.jsx'

const _HeaderItem = ({text, icon, column, sortCondition, sortFile}) => {
    return (
        <th className={ column === sortCondition ? 'active' : '' } onClick={ () => { sortFile(column)} }>
            <i className={`float-left m-r-5 fas fa-${icon}`}></i>
            { text }
            <Filter column={column}/>
        </th>
    );
}

const HeaderItem = connect(
    state    => ({ sortCondition: state.workarea.openedFiles.findById(state.workarea.activeFileId).content.sort.condition }),
    dispatch => ({ sortFile: (condition) => dispatch(sortFile(condition)) })
)(_HeaderItem)

const _Header =  ({ lang }) => {
    return (
        <thead>
            <tr>
                <HeaderItem text={lang.item.title}       column="title"       icon="code"/>
                <HeaderItem text={lang.item.type}        column="type"        icon="certificate"/>
                <HeaderItem text={lang.item.destination} column="destination" icon="handshake"/>
                <HeaderItem text={lang.item.reminder}    column="reminder"    icon="clock"/>
            </tr>
        </thead>
    );
}

export default connect(state => ({ lang: state.lang }))(_Header);