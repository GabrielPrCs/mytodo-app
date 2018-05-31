import React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux'
import { openFile, saveFile, saveFileAs, toggleAddPanel } from '../../redux/actions.js'

class _IPCH extends React.Component {
    componentDidMount() {
        ipcRenderer.on('open-file', (e, p) => this.props.openFile(p) )
        ipcRenderer.on('save-file', (e, p) => this.props.saveFile() )
        ipcRenderer.on('save-file-as', (e, p) => this.props.saveFileAs(p) )
        ipcRenderer.on('add-item',   e     => this.props.addItem() )
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => ({})
const mapDispatchToPros = dispatch => ({
    openFile: (path) => dispatch(openFile(path)),
    saveFile: () => dispatch(saveFile()),
    saveFileAs: (path) => dispatch(saveFileAs(path)),
    addItem: () => dispatch(toggleAddPanel()),
})

export default connect(mapStateToProps, mapDispatchToPros)(_IPCH)