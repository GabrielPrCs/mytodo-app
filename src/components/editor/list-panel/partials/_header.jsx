import React from 'react'
import { connect } from 'react-redux'
import { sortItems } from '../../../../redux/actions.js'

const _HeaderItem = ({text, icon, column, sort_condition, sortItems}) => {
    return (
        <th
            className={ column === sort_condition ? 'active' : '' }
            onClick={ () => { sortItems(column)} }>
                <i className={`float-left m-r-5 fas fa-${icon}`}></i>
                { text }
        </th>
    );
}

const HeaderItem = connect(
    state    => ({ sort_condition: state.current_file.sort.condition }),
    dispatch => ({ sortItems: (condition) => dispatch(sortItems(condition)) })
)(_HeaderItem)

const _Header =  ({ lang }) => {
    return (
        <thead>
            <tr>
                <HeaderItem  
                    text={lang.item.title} 
                    column="title" 
                    icon="code" 
                />
                <HeaderItem  
                    text={lang.item.type} 
                    column="type" 
                    icon="certificate" 
                />
                <HeaderItem  
                    text={lang.item.destination} 
                    column="destination" 
                    icon="handshake" 
                />
                <HeaderItem  
                    text={lang.item.reminder} 
                    column="reminder" 
                    icon="clock" 
                />
                <th className="no-hover"></th>
            </tr>
        </thead>
    );
}

export default connect(state => ({ lang: state.lang }))(_Header);