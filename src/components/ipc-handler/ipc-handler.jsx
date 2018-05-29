import React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux'
import { openFile, saveFile, toggleAddPanel } from '../../redux/actions.js'

class _IPCH extends React.Component {
    componentDidMount() {
        ipcRenderer.on('open-file', (e, p) => this.props.openFile(p) )
        ipcRenderer.on('save-file', (e, p) => this.props.saveFile(p) )
        ipcRenderer.on('add-item',   e     => this.props.addItem() )
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => ({})
const mapDispatchToPros = dispatch => ({
    openFile: (path) => dispatch(openFile(path)),
    saveFile: (path) => dispatch(saveFile(path)),
    addItem: () => dispatch(toggleAddPanel()),
})

export default connect(mapStateToProps, mapDispatchToPros)(_IPCH)