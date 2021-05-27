import React from 'react';
import { shallow } from 'enzyme';
import Main from './Main';

let wrapped = shallow(<Main/>);

describe('Main', () => {
    it('should render the Main Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });

    it('should closePopup', () => {
        wrapped.instance().onClosePopup();
        expect(wrapped.state().openedModal).toEqual(false);
    });

    it('should add new note', () => {
        const note = {
            id: 50,
            title: 'NEW NOTE',
            text: 'TEXT'
        };
        wrapped.instance().addNote(note);
        expect(wrapped.state().notes).toContain(note);
    });

    it('should generate notes block', () => {
        expect(wrapped.instance().renderNotes()).toBeTruthy();
    });

    it('should get new notes', () => {
        expect(wrapped.state().hasNotes).toEqual(true);
    });
});
