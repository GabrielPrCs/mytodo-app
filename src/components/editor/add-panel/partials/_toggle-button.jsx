import React from 'react'
import { connect } from 'react-redux'

const _ToggleButton = ({active, lang, onClick}) => {
    return (
        <button onClick={ onClick } className={`toggle-button ${active ? "active" : "null"}`}>
        { 
            active ? 
                <span><i className="fas fa-ban float-left"></i> { lang.buttons.cancel }</span> : 
                <span><i className="fas fa-plus float-left"></i> { lang.buttons.add }</span>
        }
        </button>
    );
}

export default connect(state => ({ lang: state.lang }))(_ToggleButton)