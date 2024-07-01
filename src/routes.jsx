import React, {Component} from 'react';
import {Route, Routes} from 'react-router-dom';

//import all pages
import Home from './components/pages/home/home.jsx';
import Account from './components/pages/account/account.jsx';
import Admin from './components/pages/admin/admin.jsx';
import UserProfile from './components/pages/userProfile/userProfile.jsx';
import AllPosts from './components/pages/allPosts/allPosts.jsx';

class AllRoutes extends Component {

    render() {
        return (
            <Routes>
                {this.getRoutes()}
            </Routes>
        );
    };

    getRoutes() {
        const pages = {
            home: <Home/>,
            account: <Account/>,
            userProfile: <UserProfile/>,
            admin: <Admin/>,
            allPosts: <AllPosts/>,
        };
        let routeHTML = [];

        //make the index route
        routeHTML.push(
            <Route path='/' element={<Home/>}/>
        );

        //make all the other routes
        for (let page in pages) {

            routeHTML.push(
                <Route exact path={'/'+page} element={pages[page]} />
            );
        };

        return routeHTML;
    };
};

export default AllRoutes;