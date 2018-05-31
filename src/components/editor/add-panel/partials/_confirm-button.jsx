import React from 'react'
import { connect } from 'react-redux'

const _ConfirmButton = ({lang, onClick}) => {
    return (
        <button onClick={ onClick } className="m-t-15 m-b-15 m-r-2 success-button float-right">
            <i className="fas fa-check"></i> { lang.buttons.confirm }
        </button>
    );
}

export default connect(state => ({ lang: state.lang }))(_ConfirmButton)