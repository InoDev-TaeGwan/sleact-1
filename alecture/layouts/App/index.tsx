import React from 'react';
import {Redirect, Route, Switch} from "react-router";
import loadable from "@loadable/component";

const Login = loadable(()=> import('@pages/Login')); // 코드스플리팅
const SignUp = loadable(()=> import('@pages/SignUp'));
const Workspace = loadable(()=> import('@layouts/Workspace'));

const Index = () => {
    return (
        <Switch>
            <Redirect exact path="/" to="/login" />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/workspace/:workspace" component={Workspace} />
        </Switch>
    );
};

export default Index;
