import React from 'react'
import { connect } from 'react-redux'
import { addItem, toggleAddPanel } from '../../../redux/actions.js'
import Datepicker from 'js-datepicker';

import ToggleButton from './partials/_toggle-button'
import ConfirmButton from './partials/_confirm-button'

class _AddPanel extends React.Component {
    formatDate(date) {
        var monthNames = this.props.lang.common.date.months;
        return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    }

    componentDidMount() {
        this._reminder = Datepicker('#reminder-input', {
            dateSelected: this.props.data.reminder.date ? this.props.data.reminder.date : new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            customDays: this.props.lang.common.date.days,
            customMonths: this.props.lang.common.date.months,
            overlayButton: this.props.lang.buttons.confirm,
            formatter: (el, date) => { el.value = this.formatDate(date) },
        });
    }

    componentDidUpdate() {
        this._title.value = this.props.data.title;
        this._type.value = this.props.data.type;
        this._destination.value = this.props.data.destination;
        this._description.value = this.props.data.description;
        this._reminderCheckbox.checked = this.props.data.reminder.active;
        this._reminder.el.disabled = !this.props.data.reminder.active; // Date selected is set on componentDidMount's Datepicker creation
        this._title.focus();
        this._title.style["border-color"] = "";
        this._type.style["border-color"] = "";
    }

    confirmButtonClickHandler(e) {
        e.preventDefault();

        this._title.style["border-color"] = this._title.value === '' ? 'red' : '';
        this._type.style["border-color"] = this._type.value === '' ? 'red' : '';

        if(this._title.value === '' || this._type.value === '') // Title and type are required
            return

        let item = this.props.data;
        item.title = this._title.value;
        item.type = this._type.value;
        item.destination = this._destination.value;
        item.reminder = {
            active: this._reminderCheckbox.checked,
            date: this._reminder.dateSelected,
            formated: this.formatDate(this._reminder.dateSelected)
        };
        item.description = this._description.value;

        this.props.addItem(item);
        this.props.toggleAddPanel()
    }

    render() {
        let lang = this.props.lang
        let active = this.props.active
        return (
            <div className="add-panel">

                <ToggleButton active={active} onClick={this.props.toggleAddPanel.bind(this)}/>
    
                <form className={active ? "active" : ""}>
                
                    <div className="row">
                        {/* Item title */}
                        <div className="col-6">
                            <input 
                                ref={ i => this._title = i } 
                                type="text" 
                                placeholder={ lang.item.title }
                            />
                        </div>
                        {/* Item type */}
                        <div className="col-6">
                            <input 
                                ref={ i => this._type = i } 
                                type="text" 
                                placeholder={ lang.item.type }
                            />
                        </div>
                    </div>

                    {/* Optional text */}
                    <div className="row">
                        <div className="col-12">
                            <h6 style={{display: "inline"}}>{ lang.common.optional }</h6>
                        </div>
                    </div>

                    <div className="row">
                        {/* Item destination */}
                        <div className="col-6">
                            <input 
                                ref={ i => this._destination = i } 
                                type="text" 
                                placeholder={ lang.item.destination }
                            />
                        </div>
                        {/* Item reminder checkbox */}
                        <div className="col-1">
                            <input
                                className="fas fa-clock"
                                title={`${lang.item.reminder} on/off`}
                                ref={ i => this._reminderCheckbox = i } 
                                type="checkbox"
                                onClick={ () => this._reminder.el.disabled = !this._reminder.el.disabled }
                            />
                        </div>
                        {/* Item reminder input */}
                        <div className="col-5">
                            <input id="reminder-input" type="text" readOnly/>
                        </div>
                    </div>

                    {/* Item description */}
                    <div className="row">
                        <div className="col-12">
                            <textarea 
                                ref={ i => this._description = i } 
                                placeholder={ lang.item.description }>
                            </textarea>
                        </div>
                    </div>

                    <ConfirmButton onClick={ this.confirmButtonClickHandler.bind(this) }/>
                </form>     
    
            </div>
        );
    }
}

const addPanelProps = state => ({
    lang: state.lang,
    active: state.ui.addPanel.active,
    data: state.ui.addPanel.data
});

const addPanelDispatch = dispatch => ({
    toggleAddPanel: () => dispatch(toggleAddPanel()),
    addItem: (item) => dispatch(addItem(item))
})

export default connect(addPanelProps, addPanelDispatch)(_AddPanel)