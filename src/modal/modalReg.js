import React, {Component} from "react";
import '../styles/modalReg.css'

export default class ModalReg extends Component {

    state = {
        isOpen: false
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.isOpen && (
                        <div className="modal_rm">
                            <div className="modal_body_rm">
                                <h1>Modal title</h1>
                                <button>Close modal</button>
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        )
    }
}