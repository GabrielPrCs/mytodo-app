import React from 'react';
import { connect } from 'react-redux'
import { changeActiveFile } from '../../../redux/actions.js'

const Tab = ({text, active = false, onClick}) => {
    return (
        <li title={text} className={`tab ${active ? "active" : ""}`} onClick={onClick}>
            <div>
                {text.length <= 15 ? text : `${text.substring(0,14)}...`}
                <i className="fas fa-times close-button"></i>
            </div>
        </li>
    );
}


class _Tabs extends React.Component {
    render() {
        return(
            <div className="tabs-panel">
                <ul className="tabs">
                    { this.props.opened_files.map((file, key) =>  
                        <Tab onClick={() => this.props.changeActiveFile(file.id)} key={key} text={file.name} active={this.props.activeId === file.id}/>)
                    }
                </ul>
            </div>
        )
    }
}

const Tabs = connect(
    state => ({
        activeId: state.openedFiles.currentActive,
        opened_files: state.openedFiles.list
    }),
    dispatch => ({
        changeActiveFile: id => dispatch(changeActiveFile(id))
    })
)(_Tabs)

export default Tabs;