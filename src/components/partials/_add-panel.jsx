import React from 'react'
import { connect } from 'react-redux'
import { addItem, toggleAddPanel } from '../../redux/actions.js'
import datepicker from 'js-datepicker';

class _AddPanel extends React.Component {
    componentDidMount() {
        this._toggleButton.onclick = this.toggleButtonClickHandler.bind(this);
        this._confirmButton.onclick = this.confirmButtonClickHandler.bind(this);
        this._reminder = datepicker('#reminder-input', {
            position: 'bl',
            dateSelected: this.props.data.reminder.date ? this.props.data.reminder.date : new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            customDays: this.props.lang.common.date.days,
            customMonths: this.props.lang.common.date.months,
            overlayPlaceholder: this.props.lang.common.date.enterYear,
            overlayButton: this.props.lang.buttons.confirm,
        })
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
    }

    confirmButtonClickHandler(e) {
        e.preventDefault();

        let item = this.props.data;

        item.title = this._title.value;
        item.type = this._type.value;
        item.destination = this._destination.value;
        item.reminder = {
            active: true,
            date: null
        };
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
    
                <form className={`text-right m-t-15  ${this.props.active ? "active" : ""}`}>
                    <input className="input-full" defaultValue={ this.props.data.title }  ref={ i => this._title = i } type="text" placeholder={ this.props.lang.item.title }/>
                    <input className="input-full" defaultValue={ this.props.data.type } ref={ i => this._type = i } type="text" placeholder={ this.props.lang.item.type }/>
                    <div className="optional-inputs text-left">
                        <h6 className="m-5">{ this.props.lang.common.optional }</h6>
                        <input className="input-medium" defaultValue={ this.props.data.destination } ref={ i => this._destination = i } type="text" placeholder={ this.props.lang.item.destination }/>
                        <input id="reminder-input" className="input-medium" defaultValue={ this.props.data.reminder } type="text" placeholder={ this.props.lang.item.reminder }/>
                        <textarea className="input-full" defaultValue={ this.props.data.description } ref={ i => this._description = i } placeholder={ this.props.lang.item.description }></textarea>
                        <button ref={ b => this._confirmButton = b } className="m-t-15 m-b-15 success-button float-right"><i className="fas fa-check"></i> { this.props.lang.buttons.confirm }</button>
                    </div>
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