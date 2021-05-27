import React from "react";
import Modal from "react-bootstrap/Modal";
import './ManageNote.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {CONFIG} from "../../config";
import Auth from "../../utils/Auth/Auth";

class ManageNote extends React.Component {

    state = {
        formControls: {
            title: {
                value: '',
                isValid: false,
                isBlur: false,
                errorMessage: 'This field is required.'
            },
            text: {
                value: '',
                isValid: false,
                isBlur: false,
                errorMessage: 'This field is required.'
            }
        }
    }

    componentWillReceiveProps(props) {
        const formControls = {...this.state.formControls};
        formControls.title.value = props.editMode ? props.note.title : '';
        formControls.title.isValid = props.editMode;
        formControls.text.value = props.editMode ? props.note.text : '';
        formControls.text.isValid = props.editMode;
        this.setState(formControls);
    }

    inputOnChangeHandler = (e, controlName) => {
        const formControls = {...this.state.formControls};
        formControls[controlName].value = e.target.value;

        if (formControls[controlName].value.length === 0) {
            formControls[controlName].errorMessage = 'This field is required.';
            formControls[controlName].isValid = false;
        } else {
            formControls[controlName].errorMessage = '';
            formControls[controlName].isValid = true;
        }

        this.setState(formControls);
    }

    inputOnBlurHandler = (controlName) => {
        const formControls = {...this.state.formControls};
        formControls[controlName].isBlur = true;
        this.setState(formControls);
    }

    isFormValid = () => {
        for (const controlName in this.state.formControls) {
            if (!this.state.formControls[controlName].isValid) {
                return false;
            }
        }

        return true;
    }

    saveNote = () => {
        if (this.isFormValid()) {
            if (this.props.editMode) {
                axios.put(CONFIG.apiServer + "api/notes/" + this.props.note.id, {
                    title: this.state.formControls.title.value,
                    text: this.state.formControls.text.value
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + Auth.loggedApiKey
                    }
                }).then((res) => {
                    this.props.onChangeNote(res.data.data);
                    this.props.onClosePopup();
                }).catch(() => {
                    alert('Unknown error. Please reload page and try it one more time.');
                });
            } else {
                axios.post(CONFIG.apiServer + "api/notes", {
                    title: this.state.formControls.title.value,
                    text: this.state.formControls.text.value
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + Auth.loggedApiKey
                    }
                }).then((res) => {
                    this.props.onChangeNote(res.data.data);
                    this.props.onClosePopup();
                }).catch(() => {
                    alert('Unknown error. Please reload page and try it one more time.');
                });
            }
        }
    }

    render() {
        return (
            <Modal animation={false} size="lg" show={this.props.isOpened} onHide={this.props.onClosePopup}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.editMode ? 'Edit note' : 'New note'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="block-title form-group">
                        <input className="form-control" type="text" value={this.state.formControls.title.value}
                               onChange={(e) => {this.inputOnChangeHandler(e, 'title')}}
                               onBlur={(e) => {this.inputOnBlurHandler('title')}}
                               placeholder="Title"/>
                        <small className="error-message">{this.state.formControls.title.isBlur && !this.state.formControls.title.isValid  ? this.state.formControls.title.errorMessage : ''}</small>
                    </div>
                    <div className="note-text form-group">
                        <textarea className="form-control" value={this.state.formControls.text.value}
                                  onChange={(e) => {this.inputOnChangeHandler(e, 'text')}}
                                  onBlur={(e) => {this.inputOnBlurHandler('text')}}
                                  placeholder="Text"/>
                        <small className="error-message">{this.state.formControls.text.isBlur && !this.state.formControls.text.isValid  ? this.state.formControls.text.errorMessage : ''}</small>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="option-buttons">
                        <button className="save-btn option-button" onClick={this.saveNote}><FontAwesomeIcon
                            icon="check"/> Save
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ManageNote;
