import React from 'react'
import { connect } from 'react-redux'
import { deleteItem, favoriteItem, tickItem, activeItem, toggleAddPanel } from '../../../../redux/actions.js'


const _BodyItem = ({item, newest_id, lang, activeItem, favoriteItemClickHandler, tickItemClickHandler, editItemClickHandler, deleteItemClickHandler}) => {
    return (
        <tbody onClick={ () => activeItem(item.id) } className={`list-panel-item ${item.active ? "active" : ""} ${item.favorite ? "favorite" : ""} ${item.completed ? "completed" : ""}`}> 
        <tr className="quick-info">
            <td>{ item.title }{item.id === newest_id ? <i title={ lang.item.new } className="fas fa-circle m-l-5 success-color"></i> : null}</td>
            <td>{ item.type }</td>
            <td>{ item.destination }</td>
            <td>{ item.reminder.active ? item.reminder.formated : <i className="fas fa-minus"></i> }</td>
            <td>{ item.completed ? <i className="fas fa-check-square"></i> : item.favorite ? <i className="fas fa-star"></i> : "" }</td>
            <td className="options">
                {/* Favorite option button */}
                <i 
                    title={ lang.buttons.favorite } 
                    onClick={ () => favoriteItemClickHandler(item.id) } 
                    className={`${item.favorite ? "white-color fas" : "far"} fa-star`}>
                </i>
                {/* Complete option button */}
                <i 
                    title={ lang.buttons.complete } 
                    onClick={ () => tickItemClickHandler(item.id) } 
                    className={`${item.completed ? "white-color fas" : "far"} fa-check-square`}>
                </i>
                {/* Edit option button */}
                <i 
                    title={ lang.buttons.edit } 
                    onClick={ () => editItemClickHandler(item) } 
                    className="far fa-edit">
                </i>
                {/* Remove option button */}
                <i 
                    title={ lang.buttons.remove } 
                    onClick={ () => deleteItemClickHandler(item.id) } 
                    className="far fa-trash-alt">
                </i>
            </td>
        </tr>
        <tr className="description">
            <td colSpan="5">{item.description.length > 0 ? item.description : ""}</td>
        </tr>
    </tbody>
    );
}

let dialogMessage = ""

const BodyItem = connect(
    state => {
        dialogMessage = state.lang.buttons.remove
        return ({
            lang: state.lang,
            newest_id: state.current_file.items.nextId - 1,
        })
    },
    dispatch => ({
        activeItem: (id) => { dispatch(activeItem(id)) },
        favoriteItemClickHandler: (id) => {
            dispatch(favoriteItem(id))
            // Prevents closing on td click (think to change it with css)
            dispatch(activeItem(id))
        },
        tickItemClickHandler: (id) => {
            dispatch(tickItem(id))
            // Prevents closing on td click (think to change it with css)
            dispatch(activeItem(id))
        },
        editItemClickHandler: (item) => {
            dispatch(toggleAddPanel(true, item))
            // Prevents closing on td click (think to change it with css)
            dispatch(activeItem(item.id))
        },
        deleteItemClickHandler: (id) => {
            // Prevents closing on td click (think to change it with css)
            dispatch(activeItem(id))
            vex.dialog.confirm({
                message: dialogMessage + "?",
                callback: (value) => {
                    if (value)
                        dispatch(deleteItem(id));
                }
            })
        }

    })
)(_BodyItem)

const _Body = ({current_file}) => {
    return (
        current_file.items.list.map((item, key) => {
            if(item.visible) {
                // Just on tr can be returned, so tbody is necessary
                return (
                    <BodyItem item={item} key={key}/>
                );
            }
        })
    );
}

export default connect(
    state => ({
        current_file: state.current_file
    })
)(_Body)