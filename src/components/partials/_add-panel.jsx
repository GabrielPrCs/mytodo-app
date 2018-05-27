import React from 'react'
import { connect } from 'react-redux'
import { addItem, toggleAddPanel } from '../../redux/actions.js'
import Datepicker from 'js-datepicker';

class _AddPanel extends React.Component {

    handleKeyDown(e) {
        if(this.props.active) {
            e.preventDefault()
            switch( e.keyCode ) {
                case 27: // ESCAPE
                    this.props.toggleAddPanel()
                    break;
                case 13: // ENTER
                    this._confirmButton.click()
                    break;
                default: 
                    break;
            }
        }
    }

    componentDidMount() {
        this._toggleButton.onclick = this.toggleButtonClickHandler.bind(this);
        this._confirmButton.onclick = this.confirmButtonClickHandler.bind(this);
        this._reminder = Datepicker('#reminder-input', {
            position: 'bl',
            dateSelected: this.props.data.reminder.date ? this.props.data.reminder.date : new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            customDays: this.props.lang.common.date.days,
            customMonths: this.props.lang.common.date.months,
            overlayPlaceholder: this.props.lang.common.date.enterYear,
            overlayButton: this.props.lang.buttons.confirm,
            formatter: (el, date) => {
                el.value = this.formatDate(date)
            },
        })

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    resetInputs() {
        this._title.style["border-color"] = "";
        this._type.style["border-color"] = "";
    }

    toggleButtonClickHandler() {
        this.props.toggleAddPanel();
        this.resetInputs();
    }

    componentDidUpdate() {
        this._title.value = this.props.data.title;
        this._type.value = this.props.data.type;
        this._destination.value = this.props.data.destination;
        this._description.value = this.props.data.description;
        this._reminderCheckbox.checked = this.props.data.reminder.active;
        this._reminder.el.disabled = !this.props.data.reminder.active;
    }

    reminderCheckboxClickHandler() {
        this._reminder.el.disabled = !this._reminder.el.disabled
    }

    confirmButtonClickHandler(e) {
        e.preventDefault();

        let item = this.props.data;

        item.title = this._title.value;
        item.type = this._type.value;
        item.destination = this._destination.value;
        item.reminder = {
            active: this._reminderCheckbox.checked,
            date: this._reminder.dateSelected,
            formated: this.formatDate(this._reminder.dateSelected)
        }
        item.description = this._description.value;

        // Here changes the color on re-click
        this.resetInputs()

        if(item.title === '' || item.type === '') {
            if(item.title === '') {
                this._title.style["border-color"] = "red";
            }
            if(item.type === '') {
                this._type.style["border-color"] = "red";
            }
            return
        }

        this.props.addItem(item)
        this.toggleButtonClickHandler()
    }

    formatDate(date) {
        var monthNames = this.props.lang.common.date.months;
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year
    }

    render() {
        return (
            <div className="add-panel">

                <button ref={ b => this._toggleButton = b } className={`toggle-button ${this.props.active ? "active" : "null"}`}>
                { 
                    this.props.active ? 
                        <span><i className="fas fa-ban float-left"></i> { this.props.lang.buttons.cancel }</span> : 
                        <span><i className="fas fa-plus float-left"></i> { this.props.lang.buttons.add }</span>
                }
                </button>
    
                <form className={`text-left m-t-15  ${this.props.active ? "active" : ""}`}>
                    <div className="row">
                        {/* Item title */}
                        <div className="col-6">
                            <input 
                                ref={ i => this._title = i } 
                                type="text" 
                                placeholder={ this.props.lang.item.title }
                            />
                        </div>
                        {/* Item type */}
                        <div className="col-6">
                            <input 
                                ref={ i => this._type = i } 
                                type="text" 
                                placeholder={ this.props.lang.item.type }
                            />
                        </div>
                    </div>

                    {/* Optional text */}
                    <div className="row">
                        <div className="col-12">
                            <h6 style={{display: "inline"}}>{ this.props.lang.common.optional }</h6>
                        </div>
                    </div>

                    <div className="row">
                        {/* Item destination */}
                        <div className="col-6">
                            <input 
                                ref={ i => this._destination = i } 
                                type="text" 
                                placeholder={ this.props.lang.item.destination }
                            />
                        </div>
                        {/* Item reminder checkbox */}
                        <div className="col-1">
                            <input
                                className="fas fa-clock"
                                title={`${this.props.lang.item.reminder} on/off`}
                                ref={ i => this._reminderCheckbox = i } 
                                type="checkbox"
                                onClick={ this.reminderCheckboxClickHandler.bind(this) }
                            />
                        </div>
                        {/* Item reminder input */}
                        <div className="col-5">
                            <input id="reminder-input" type="text" readOnly/>
                        </div>
                    </div>

                    <div className="row">
                        {/* Item description */}
                        <div className="col-12">
                            <textarea 
                                ref={ i => this._description = i } 
                                placeholder={ this.props.lang.item.description }>
                            </textarea>
                        </div>
                    </div>

                    {/* Confirm button */}
                    <button ref={ b => this._confirmButton = b } className="m-t-15 m-b-15 success-button float-right"><i className="fas fa-check"></i> { this.props.lang.buttons.confirm }</button>
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