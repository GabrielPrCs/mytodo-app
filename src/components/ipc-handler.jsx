import React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux'
import { openFile, saveFile } from '../redux/actions.js'

class _IPCH extends React.Component {
    componentDidMount() {
        ipcRenderer.on('open-file', (e, path) => {
            this.props.openFile(path)
        })

        ipcRenderer.on('save-file', (e, path) => {
            this.props.saveFile(path)
        })

    }

    render() {
        return (null);
    }
}

const mapStateToProps = state => ({})
const mapDispatchToPros = dispatch => ({
    openFile: (path) => dispatch(openFile(path)),
    saveFile: (path) => dispatch(saveFile(path)),
})

export default connect(mapStateToProps, mapDispatchToPros)(_IPCH)