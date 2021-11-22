import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';
import Dashboard from './Dashboard';
import Designs from './Designs';
import Manufacturers from './Manufacturers';
import Products from './Products';
import Retailers from './Retailers';
import Users from './Users';

const Router = ({ before }) => (
    <BrowserRouter>
        {before}
        <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/retailers" element={<Retailers />} />
            <Route path="/users" element={<Users />} />
            <Route element={<NotFound />} />
        </Routes>
    </BrowserRouter>
);

Router.propTypes = {
    before: PropTypes.node,
};

Router.defaultProps = {
    before: null,
};

export default Router;
