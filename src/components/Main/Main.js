import React from "react";
import Note from './Note/Note'
import axios from "axios";
import {CONFIG} from "../../config";
import Auth from "../../utils/Auth/Auth";
import "./Main.scss"
import ManageNote from "../ManageNote/ManageNote";

class Main extends React.Component {
    state = {
        notes: [],
        hasNotes: true,
        openedModal: false,
    }

    componentDidMount = () => {
        axios.get(CONFIG.apiServer + "api/notes",{
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + Auth.loggedApiKey
            }
        }).then((res) => {
            this.setState({
                notes: res.data.data,
                hasNotes: false
            });
        }).catch((error) => {
            this.setState({
                hasNotes: false
            });
        });
    }

    renderNotes = () => {
        const notes = [...this.state.notes];

        if (notes.length === 0 && !this.state.hasNotes) {
            return (

                    <div className="card default-block">
                        <h5 className="text-center">You don`t have notes!</h5>
                    </div>

            );
        }

        return notes.map((note, index) => (
                <Note
                    key={index}
                    note={note}
                />
            )
        );
    }

    addNote = (note) => {
        const notes = [...this.state.notes];
        notes.unshift(note);
        this.setState({notes});
    }

    onClosePopup = () => {
        this.setState({openedModal: false});
    }

    render() {
        return (
            <React.Fragment>
                <ManageNote
                    isOpened={this.state.openedModal}
                    onClosePopup={this.onClosePopup}
                    editMode={false}
                    onChangeNote={this.addNote}
                />
                <button className="add-new-note-btn" onClick={() => {this.setState({openedModal: true})}}/>
                <div className="container-fluid">
                        <div className="">
                            <div className="card-columns">
                                {this.renderNotes()}
                            </div>
                        </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Main;
