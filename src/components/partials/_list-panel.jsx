import React from 'react'
import { connect } from 'react-redux'
import { deleteItem, favoriteItem, sortItems, tickItem, activeItem, toggleAddPanel } from '../../redux/actions.js'

class _ListPanel extends React.Component {
    favoriteItem(id) {
        this.props.favoriteItem(id);
    }

    deleteItem(id) {
        vex.dialog.confirm({
            message: this.props.lang.buttons.remove + "?",
            callback: (value) => {
                if (value) {
                    this.props.deleteItem(id);
                } 
            }
        })
    }

    editItem(item) {
        this.props.toggleAddPanel(true, item)
    }

    tickItem(id) {
        this.props.tickItem(id)
    }

    activeItem(id) {
        this.props.activeItem(id)
    }

    headerItemClickHandler(condition) {
        this.props.sortItems(condition);
    }

    render() {
        return (
            <div className="list-panel">
                <table>
                    <thead>
                        <tr ref={ tr => this._headerRow = tr }>
                            <th className={ this.props.current_file.sort.condition === 'title' ? 'active' : '' } onClick={() => { this.headerItemClickHandler("title") }}>{ this.props.lang.item.title }<i className="float-left m-r-5 fas fa-code"></i></th>
                            <th className={ this.props.current_file.sort.condition === 'type' ? 'active' : '' } onClick={() => { this.headerItemClickHandler("type") }}>{ this.props.lang.item.type }<i className="float-left m-r-5 fas fa-certificate"></i></th>
                            <th className={ this.props.current_file.sort.condition === 'destination' ? 'active' : '' } onClick={() => { this.headerItemClickHandler("destination") }}>{ this.props.lang.item.destination }<i className="float-left m-r-5 fas fa-handshake"></i></th>
                            <th className={ this.props.current_file.sort.condition === 'reminder' ? 'active' : '' } onClick={() => { this.headerItemClickHandler("reminder") }}>{ this.props.lang.item.reminder }<i className="float-left m-r-5 fas fa-clock"></i></th>
                            <th className="no-hover"></th>
                        </tr>
                    </thead>
                    {
                        this.props.current_file.items.map((item, key) => {
                            if(item.visible) {
                                return (
                                    // Just on tr can be returned, so tbody is necessary
                                    // Add expand attribute to object
                                    <tbody onClick={ () => this.activeItem(item.id) } className={`list-panel-item ${item.active ? "active" : ""} ${item.favorite ? "favorite" : ""} ${item.completed ? "completed" : ""}`} key={key}> 
                                        <tr className="quick-info">
                                            <td> { item.title }{item.id === this.props.current_file.ids - 1 ? <i title={ this.props.lang.item.new } className="fas fa-circle m-l-5 success-color reduced-size-font"></i> : null}</td>
                                            <td>{ item.type }</td>
                                            <td>{ item.destination }</td>
                                            <td>23/05/2018</td>
                                            <td>{ item.completed ? <i className="fas fa-check-square"></i> : item.favorite ? <i className="fas fa-star"></i> : "" }</td>
                                            <td className="options">
                                                <i title={ this.props.lang.buttons.favorite } onClick={ () => this.favoriteItem(item.id) } className={`${item.favorite ? "white-color fas" : "far"} fa-star`}></i>
                                                <i title={ this.props.lang.buttons.complete } onClick={ () => this.tickItem(item.id) } className={`${item.completed ? "white-color fas" : "far"} fa-check-square`}></i>
                                                <i title={ this.props.lang.buttons.edit } onClick={ () => this.editItem(item) } className="far fa-edit"></i>
                                                <i title={ this.props.lang.buttons.remove } onClick={ () => this.deleteItem(item.id) } className="far fa-trash-alt"></i>
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