import React from 'react'
import { connect } from 'react-redux'
import { deleteItem, favoriteItem, tickItem, activeItem, toggleAddPanel } from '../../../../redux/actions.js'


const _BodyItem = ({item, newest_id, lang, activeItem, favoriteItemClickHandler, tickItemClickHandler, editItemClickHandler, deleteItemClickHandler}) => {
    // Just on tr can be returned, so tbody is necessary
    return (
        <tbody onClick={ () => activeItem(item.id) }
               className={`list-panel-item
                           ${item.active    ? "active"    : ""}
                           ${!item.visible  ? "hide"      : ""}
                           ${item.favorite  ? "favorite"  : ""}
                           ${item.completed ? "completed" : ""}`}
        > 
            <tr className="quick-info">
                <td className="title-td">{ item.title }</td>
                <td className="type-td">{ item.type }</td>
                <td className="destination-td">{ item.destination ? item.destination : <i className="fas fa-minus"></i> }</td>
                <td className="reminder-td">{ item.reminder.active ? item.reminder.formated : <i className="fas fa-minus"></i> }</td>
                <td className="options">
                    {/* Favorite option button */}
                    <i title={ lang.buttons.favorite } 
                       onClick={ e => favoriteItemClickHandler(e, item.id) }
                       className={`${item.favorite ? "white-color fas" : "far"} fa-star`}>
                    </i>
                    {/* Complete option button */}
                    <i title={ lang.buttons.complete } 
                       onClick={ e => tickItemClickHandler(e, item.id) } 
                       className={`${item.completed ? "white-color fas" : "far"} fa-check-square`}>
                    </i>
                    {/* Edit option button */}
                    <i title={ lang.buttons.edit } 
                       onClick={ e => editItemClickHandler(e, item) } 
                       className="far fa-edit">
                    </i>
                    {/* Remove option button */}
                    <i title={ lang.buttons.remove } 
                       onClick={ e => deleteItemClickHandler(e, item.id) } 
                       className="far fa-trash-alt">
                    </i>
                </td>
            </tr>
            <tr className="description">
                <td colSpan="5">{item.description.length > 0 ? item.description : <i className="fas fa-minus"></i>}</td>
            </tr>
        </tbody>
    );
}

let dialogMessage = ""
const BodyItem = connect(
    state => {
        dialogMessage = state.lang.buttons.remove
        return ({ lang: state.lang })
    },
    dispatch => ({
        activeItem: (id) => { dispatch(activeItem(id)) },
        favoriteItemClickHandler: (e, id) => {
            e.stopPropagation() // Prevents the item from being activated / deactivated
            dispatch(favoriteItem(id))
        },
        tickItemClickHandler: (e, id) => {
            e.stopPropagation() // Prevents the item from being activated / deactivated
            dispatch(tickItem(id))
        },
        editItemClickHandler: (e, item) => {
            e.stopPropagation() // Prevents the item from being activated / deactivated
            dispatch(toggleAddPanel(true, item))
        },
        deleteItemClickHandler: (e, id) => {
            e.stopPropagation() // Prevents the item from being activated / deactivated
            vex.dialog.confirm({ message: dialogMessage + "?", callback: (value) => { if (value) dispatch(deleteItem(id)) }})
        }
    })
)(_BodyItem)

const _Body = ({list}) => list.map((item, key) => <BodyItem item={item} key={key}/>)

export default connect(state => ({ list: state.openedFiles.activeFile.items.list }))(_Body)