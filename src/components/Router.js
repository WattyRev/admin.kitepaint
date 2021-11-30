import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';
import Dashboard from './Dashboard';
import Designs from './Designs';
import Manufacturers from './Manufacturers';
import Products from './Products';
import Users from './Users';

const Router = ({ before }) => (
    <HashRouter>
        {before}
        <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            <Route element={<NotFound />} />
        </Routes>
    </HashRouter>
);

Router.propTypes = {
    /** Content to be rendered before the routes */
    before: PropTypes.node,
};

Router.defaultProps = {
    before: null,
};

export default Router;
