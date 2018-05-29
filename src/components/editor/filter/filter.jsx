import React from 'react'
import { connect } from 'react-redux'
import { addFilterCondition, removeFilterCondition, clearFilterConditions } from '../../../redux/actions';
import hash from 'object-hash';

class _Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }

    checkboxClickHandler(target, type, content) {
        let obj = {type, content}
        if(target.checked)
            this.props.addFilterCondition(hash(obj), obj.type, obj.content)
        else
            this.props.removeFilterCondition(hash(obj))
    }

    onClick(e) {
        e.stopPropagation()
        this.setState({active: !this.state.active});
    }

    render() {
        let list = this.props.possibilities[this.props.column]
        if(list)
            return (

                <div className="filter" onClick={this.onClick.bind(this)}>
                    <i className="fas fa-filter filter-button"></i>

                    <div className={`filter-options ${ this.state.active ? "active" : "" }`} onClick={e => e.stopPropagation()}>
                    {
                        list.length > 0 ? 
                            list.map((e, key) => {
                                return (
                                    <label key={key}>
                                        <input 
                                            type="checkbox"
                                            onClick={(event) => this.checkboxClickHandler(event.target, this.props.column, e.content)}
                                        />
                                        { e.content }
                                    </label>
                                );
                            })
                            : /* else */
                            <label>No data (change it on lang)</label>
                    }
                    </div>
                
                </div>
            );
        else
            return null;
    }
}

const mapStateToProps = state => ({
    lang: state.lang,
    possibilities: state.current_file.filter.possibilities,
    filterItems: state.current_file.filter.list
})

const mapDispatchToProps = dispatch => ({
    addFilterCondition: (id, field, condition) => dispatch(addFilterCondition(id, field, condition)),
    removeFilterCondition: (field, condition) => dispatch(removeFilterCondition(field, condition)),
    clearFilterConditions: () => dispatch(clearFilterConditions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(_Filter);