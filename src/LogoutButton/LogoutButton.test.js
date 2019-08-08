import React from 'react';
import ReactDOM from 'react-dom';
import LogoutButton from './LogoutButton';
import {BrowserRouter} from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<BrowserRouter><LogoutButton/></BrowserRouter>, div);

    ReactDOM.unmountComponentAtNode(div);
});