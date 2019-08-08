import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import TheaterRoom from './TheaterRoom';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<BrowserRouter><TheaterRoom/></BrowserRouter>, div);

    ReactDOM.unmountComponentAtNode(div);
});