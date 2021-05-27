import React from "react";
import './Note.scss'
import {Link} from "react-router-dom";

function Note(props) {
    return (
        <div className="card note-wrapper default-block">
            <Link to={'/note/' + props.note.id}>
                <div className="note">
                    <div className="note-header">
                        <h3>{props.note.title}</h3>
                    </div>
                    <div className="note-body">
                        <p>{props.note.text}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default Note;
