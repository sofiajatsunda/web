import React from 'react';
import { shallow } from 'enzyme';
import Note from './Note';
import {Link} from "react-router-dom";

const note = {
    id: 1,
    title: 'Note title',
    text: 'Note text'
};
let wrapped = shallow(<Note note={note}/>);

describe('Note', () => {
    it('should render the Note Component correctly', () => {
        expect(wrapped).toMatchSnapshot();
    });
    it('should render the link to Note', () => {
        expect(wrapped.find('a'));
    })
    it('right link address', () => {
        expect(wrapped.find(Link).props().to).toEqual('/note/' + note.id);
    })
    it('right title', () => {
        expect(wrapped.find('h3').text()).toEqual(note.title);
    })
    it('right text', () => {
        expect(wrapped.find('p').text()).toEqual(note.text);
    })
});
