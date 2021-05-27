import React from "react";
import "./Note.scss";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import axios from "axios";
import {CONFIG} from "../../config";
import Auth from "../../utils/Auth/Auth";
import ManageNote from "../ManageNote/ManageNote";

class Note extends React.Component {

    state = {
        note: null,
        authors: [],
        openedModal: false,
        isFound: true,
        viewedAuthorInput: false,
        formControls: {
            authorEmail: {
                value: '',
                isValid: '',
                isBlur: '',
                errorMessage: ''
            }
        }
    }

    componentDidMount = () => {
        axios.get(CONFIG.apiServer + "api/notes/" + this.props.match.params.id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + Auth.loggedApiKey
            }
        }).then((res) => {
            this.setState({
                note: res.data.data
            });
            axios.get(CONFIG.apiServer + "api/authors/note/" + this.props.match.params.id, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + Auth.loggedApiKey
                }
            }).then((res) => {
                this.setState({
                    authors: res.data.data
                });
            })
        }).catch((error) => {
            this.setState({isFound: false});
        });
    }

    renderAuthors = () => {
        return this.state.authors.map((author, index) => (
                <li key={index} className={author.is_creator === 1 ? "main-author" : ""}>
                    {!author.is_creator ? <FontAwesomeIcon icon="trash-alt"
                    onClick={() => {this.deleteAuthor(author)}}
                    /> : '' }
                    {author.name} <small>({author.email})</small>
                    </li>
            )
        );
    }

    deleteAuthor = (author) => {
        const authors = [...this.state.authors];
        var index = authors.indexOf(author);
        if (index > -1) {
            axios.delete(CONFIG.apiServer + "api/authors/" + author.id, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + Auth.loggedApiKey
                }
            }).then((res) => {
                authors.splice(index, 1);
                this.setState({authors});
            }).catch((error) => {
                alert('Unknown error. Please reload page and try it one more time.');
            });
        }


    }

    onClosePopup = () => {
        this.setState({openedModal: false})
    }

    onChangeNote = (note) => {
        this.setState({note: note});
    }

    deleteNote = () => {
        if (window.confirm('Do you really want to delete this note?')) {
            axios.delete(CONFIG.apiServer + "api/notes/" + this.state.note.id, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + Auth.loggedApiKey
                }
            }).then((res) => {
                window.location.href = "/";
            }).catch(() => {
                alert('Unknown error. Please reload page and try it one more time.');
            });
        }
    }

    inputOnBlurHandler = (controlName) => {
        const formControls = {...this.state.formControls};
        formControls[controlName].isBlur = true;
        this.setState(formControls);
    }

    inputOnChangeHandler = (e, controlName) => {
        const formControls = {...this.state.formControls};
        formControls[controlName].value = e.target.value;
        formControls[controlName].errorMessage = '';
        formControls[controlName].isValid = true;

        if (formControls[controlName].value.length === 0) {
            formControls[controlName].errorMessage = 'This field is required.';
            formControls[controlName].isValid = false;
        }
        if(controlName === 'authorEmail') {
            // eslint-disable-next-line
            let validEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!validEmailRegex.test(formControls[controlName].value)) {
                formControls[controlName].errorMessage = 'Invalid email.';
                formControls[controlName].isValid = false;
            }
        }

        this.setState({formControls});
    }

    onAddAuthor = () => {
        if (this.state.formControls.authorEmail.isValid) {
            axios.post(CONFIG.apiServer + "api/authors/note/" + this.state.note.id, {
                email: this.state.formControls.authorEmail.value,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + Auth.loggedApiKey
                }
            }).then((res) => {
                const authors = [...this.state.authors];
                authors.push(res.data.data);
                this.setState({
                    viewedAuthorInput: false,
                    authors: authors
                });
            }).catch((error) => {
                const formControls = {...this.state.formControls};
                if (error.response.data.data.note_id) {
                    formControls.authorEmail.errorMessage = error.response.data.data.note_id;
                    formControls.authorEmail.isValid = false;
                } else if (error.response.data.data.email) {
                    formControls.authorEmail.errorMessage = error.response.data.data.email;
                    formControls.authorEmail.isValid = false;
                } else {
                    alert('Unknown error. Please reload page and try it one more time.');
                }
                this.setState({formControls});
            });
        }
    }

    renderFunctionalityToAddAuthor = () => {
        if (!this.state.viewedAuthorInput) {
            return (
                <li key={'u123'}>
                    <button className="btn note-add-new" onClick={() => {this.setState({viewedAuthorInput: true})}}>
                        <FontAwesomeIcon icon="user-plus"/> Add new
                    </button>
                </li>
            );
        } else {
            return (
                <li key={'u123'}>
                    <div className="form-group">
                        <input className="form-control" value={this.state.formControls.authorEmail.value}
                               onChange={(e) => {this.inputOnChangeHandler(e,'authorEmail')}}
                               onBlur={(e) => {this.inputOnBlurHandler('authorEmail')}}/>
                        <small className="error-message">{this.state.formControls.authorEmail.isBlur && !this.state.formControls.authorEmail.isValid  ? this.state.formControls.authorEmail.errorMessage : ''}</small>
                    </div>
                    <div className="form-group">
                        <button className="btn note-add-new" onClick={this.onAddAuthor}><FontAwesomeIcon icon="user-plus"/> Add</button>
                    </div>
                </li>
            );
        }
    }

    render() {
        if (this.state.isFound && !this.state.note) {
            return (
                <div className="container">
                    <div className="default-block">
                        <h5 className="text-center">Loading...</h5>
                    </div>
                </div>
            );
        }

        if (!this.state.isFound) {
            return (
                <div className="container">
                    <div className="default-block">
                        <h5 className="text-center">Note not found!</h5>
                    </div>
                </div>
            );
        }

        return (
            <div className="container">
                <ManageNote
                    isOpened={this.state.openedModal}
                    onClosePopup={this.onClosePopup}
                    editMode={true}
                    note={this.state.note}
                    onChangeNote={this.onChangeNote}
                />
                <div className="row">
                    <div className="col-lg-8">
                        <div className="default-block">
                            <div className="option-buttons">
                                <button className="edit-btn option-button" onClick={() => {
                                    this.setState({openedModal: true})
                                }}><FontAwesomeIcon icon="pen"/> Edit
                                </button>
                                <button className="delete-btn option-button" onClick={this.deleteNote}><FontAwesomeIcon
                                    icon="trash-alt"/> Delete
                                </button>
                            </div>
                            <h2 className="block-title">{this.state.note.title}</h2>
                            <div className="note-text">
                                <div>{this.state.note.text}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="default-block">
                            <h2 className="block-title">Authors</h2>
                            <ul className="note-authors">
                                {this.renderAuthors()}
                                {this.renderFunctionalityToAddAuthor()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Note;
