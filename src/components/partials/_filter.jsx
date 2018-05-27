import React from 'react'
import { connect } from 'react-redux'
import { addFilterItems, removeFilterItems, clearFilterItems } from '../../redux/actions';

class _Filter extends React.Component {
    addFilter() {
        vex.dialog.prompt({
            message: this.props.lang.filter.add,
            input: [
                `<select name="election">`,
                    `<option value="title">${ this.props.lang.item.title }</option>`,
                    `<option value="type">${ this.props.lang.item.type }</option>`,
                    `<option value="destination">${ this.props.lang.item.destination }</option>`,
                    `<option value="reminder">${ this.props.lang.item.reminder }</option>`,
                    `<option value="description">${ this.props.lang.item.description }</option>`,
                `</select>`
            ].join(''),
            callback: (field) => {
                if(field) {
                    if(field === "title" || field === "type" || field === "destination" || field === "description") {
                        vex.dialog.prompt({
                            message: this.props.lang.filter.add,
                            placeholder: this.props.lang.filter.words,
                            callback: (condition) => {
                                if(condition) {
                                    let c = condition.split(',');
                                    c.forEach(e => {
                                        console.log(e);
                                        this.props.addFilterItems(field, e)
                                    });
                                }
                            }
                        })
                    }
                    else {
                        alert("Not supported")
                    }
                }
            }
        })
    }

    removeFilter() {
        let input = [];
        input.push('<select name="election">')
        this.props.filterItems.forEach((f) => {
            input.push(`<option value="${f.id}">${f.field}: ${f.condition}</option>`);
        })
        input.push('</select>')

        vex.dialog.prompt({
            message: this.props.lang.filter.remove,
            input: input.join(''),
            callback: (election) => {
                if(election) {
                    this.props.removeFilterItems(parseInt(election))
                }
            }
        })
    }

    clearFilterItems() {
        vex.dialog.confirm({
            message: this.props.lang.filter.clear + "?",
            callback: (value) => {
                if (value) {
                    this.props.clearFilterItems()
                }
            }
        })
    }

    render() {
        return(
            <div id="filter-panel" className="text-right">
                <button title={ this.props.lang.filter.add } onClick={ this.addFilter.bind(this) }>
                    <small>
                        <i className="fas fa-plus"></i>
                    </small>
                    <i className="fas fa-filter"></i>
                </button>

                <button title={ this.props.lang.filter.remove } onClick={ this.removeFilter.bind(this) }>
                    <small>
                        <i className="fas fa-minus"></i>
                    </small>
                    <i className="fas fa-filter"></i>
                </button>

                <button title={ this.props.lang.filter.clear } onClick={ this.clearFilterItems.bind(this) } >
                    <i className="fas fa-eraser"></i>
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.lang,
    filterItems: state.current_file.filter.list
});

const mapDispatchToProps = dispatch => ({
    addFilterItems: (field, condition) => dispatch(addFilterItems(field, condition)),
    removeFilterItems: (field, condition) => dispatch(removeFilterItems(field, condition)),
    clearFilterItems: () => dispatch(clearFilterItems()),
})

export default connect(mapStateToProps, mapDispatchToProps)(_Filter);