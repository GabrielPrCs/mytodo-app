import React from 'react'
import { connect } from 'react-redux'
import { addFilterCondition, removeFilterCondition, clearFilterConditions } from '../../../../redux/actions.js'
import hash from 'object-hash';

class _Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false, searchValue: "" }
    }

    componentDidMount() {
        document.addEventListener("click", e => {
            if(!this._filter.contains(e.target))
                this.setState({active: false})
        })

        this._search.addEventListener('input', e => {
            this.setState({searchValue: this._search.value})
        });
    }

    componentDidUpdate() {
        this._search.focus()
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
        let shouldRender = list.length > 0
        list = list.filter(i => i.content.includes(this.state.searchValue))
        return (
            <div ref={ d => this._filter = d }   className={`${!shouldRender ? "hide" : ""} filter`} onClick={this.onClick.bind(this)}>
                <i className="fas fa-filter filter-button" title={this.props.lang.filter.show}></i>
                <div className={`filter-options ${ this.state.active ? "active" : "" }`} onClick={e => e.stopPropagation()}>
                    <input className="filter-search" ref={i => this._search = i} type="text" placeholder={`${this.props.lang.buttons.search}...`}/>
                {
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
                }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    lang: state.lang,
    possibilities: state.openedFiles.activeFile.filter.possibilities,
})

const mapDispatchToProps = dispatch => ({
    addFilterCondition: (id, field, condition) => dispatch(addFilterCondition(id, field, condition)),
    removeFilterCondition: (field, condition) => dispatch(removeFilterCondition(field, condition)),
    clearFilterConditions: () => dispatch(clearFilterConditions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(_Filter);