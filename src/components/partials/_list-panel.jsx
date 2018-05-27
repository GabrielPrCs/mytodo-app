import React from 'react'
import { connect } from 'react-redux'
import { deleteItem, favoriteItem, sortItems, tickItem, activeItem, toggleAddPanel } from '../../redux/actions.js'

class _ListPanel extends React.Component {

    favoriteItemClickHandler(id) {
        this.props.favoriteItem(id)
        // Prevents closing on td click (think to change it with css)
        this.props.activeItem(id)
    }

    tickItemClickHandler(id) {
        this.props.tickItem(id)
        // Prevents closing on td click (think to change it with css)
        this.props.activeItem(id)
    }

    deleteItemClickHandler(id) {
        // Prevents closing on td click (think to change it with css)
        this.props.activeItem(id)
        vex.dialog.confirm({
            message: this.props.lang.buttons.remove + "?",
            callback: (value) => {
                if (value) {
                    this.props.deleteItem(id);
                    
                } 
            }
        })
    }

    editItemClickHandler(item) {
        this.props.toggleAddPanel(true, item)
        // Prevents closing on td click (think to change it with css)
        this.props.activeItem(item.id)
    }

    render() {
        return (
            <div className="list-panel">
                <table>
                    <thead>
                        <tr ref={ tr => this._headerRow = tr }>
                            <th className={ this.props.current_file.sort.condition === 'title' ? 'active' : '' } onClick={() => { this.props.sortItems("title") }}>{ this.props.lang.item.title }<i className="float-left m-r-5 fas fa-code"></i></th>
                            <th className={ this.props.current_file.sort.condition === 'type' ? 'active' : '' } onClick={() => { this.props.sortItems("type") }}>{ this.props.lang.item.type }<i className="float-left m-r-5 fas fa-certificate"></i></th>
                            <th className={ this.props.current_file.sort.condition === 'destination' ? 'active' : '' } onClick={() => { this.props.sortItems("destination") }}>{ this.props.lang.item.destination }<i className="float-left m-r-5 fas fa-handshake"></i></th>
                            <th className={ this.props.current_file.sort.condition === 'reminder' ? 'active' : '' } onClick={() => { this.props.sortItems("reminder") }}>{ this.props.lang.item.reminder }<i className="float-left m-r-5 fas fa-clock"></i></th>
                            <th className="no-hover"></th>
                        </tr>
                    </thead>
                    {
                        this.props.current_file.items.map((item, key) => {
                            if(item.visible) {
                                // Just on tr can be returned, so tbody is necessary
                                return (
                                    <tbody onClick={ () => this.props.activeItem(item.id) } className={`list-panel-item ${item.active ? "active" : ""} ${item.favorite ? "favorite" : ""} ${item.completed ? "completed" : ""}`} key={key}> 
                                        <tr className="quick-info">
                                            <td> { item.title }{item.id === this.props.current_file.ids - 1 ? <i title={ this.props.lang.item.new } className="fas fa-circle m-l-5 success-color reduced-size-font"></i> : null}</td>
                                            <td>{ item.type }</td>
                                            <td>{ item.destination }</td>
                                            <td>{ item.reminder.active ? item.reminder.formated : <i className="fas fa-minus"></i> }</td>
                                            <td>{ item.completed ? <i className="fas fa-check-square"></i> : item.favorite ? <i className="fas fa-star"></i> : "" }</td>
                                            <td className="options">
                                                {/* Favorite option button */}
                                                <i 
                                                    title={ this.props.lang.buttons.favorite } 
                                                    onClick={ () => this.favoriteItemClickHandler(item.id) } 
                                                    className={`${item.favorite ? "white-color fas" : "far"} fa-star`}>
                                                </i>
                                                {/* Complete option button */}
                                                <i 
                                                    title={ this.props.lang.buttons.complete } 
                                                    onClick={ () => this.tickItemClickHandler(item.id) } 
                                                    className={`${item.completed ? "white-color fas" : "far"} fa-check-square`}>
                                                </i>
                                                {/* Edit option button */}
                                                <i 
                                                    title={ this.props.lang.buttons.edit } 
                                                    onClick={ () => this.editItemClickHandler(item) } 
                                                    className="far fa-edit">
                                                </i>
                                                {/* Remove option button */}
                                                <i 
                                                    title={ this.props.lang.buttons.remove } 
                                                    onClick={ () => this.deleteItemClickHandler(item.id) } 
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
                        })
                    }
                </table>
            </div>
        );
    }
}

const listPanelProps = state => ({
    lang: state.lang,
    current_file: state.current_file
})

const listPanelDispatch = (dispatch) => ({
    toggleAddPanel: (forceActive, data) => dispatch(toggleAddPanel(forceActive, data)),    
    favoriteItem: (id) => dispatch(favoriteItem(id)),
    deleteItem: (id) => dispatch(deleteItem(id)),
    tickItem: (id) => dispatch(tickItem(id)),
    activeItem: (id) => dispatch(activeItem(id)),
    sortItems: (condition) => dispatch(sortItems(condition)),
})

export default connect(listPanelProps, listPanelDispatch)(_ListPanel)