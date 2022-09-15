import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import "./styles/global.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Redirect, Route, Router, Switch, useHistory, useLocation} from "react-router-dom";
import {RoleList} from "./pages/RoleList";
import {SignIn} from "./pages/Auth/SignIn/SignIn";
import {RoleItem} from "./pages/RoleItem";
import {AccessList} from "./pages/AccessList";
import {UserList} from "./pages/UserList";
import {UserItem} from "./pages/UserItem";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {authApi} from "./api/authApi";

const routes = {
  '/roles/:id': RoleItem,
  '/roles': RoleList,
  '/users/:id': UserItem,
  '/users': UserList,
  '/access': AccessList,
  '/signin': SignIn,
};

function App() {
    const location = window.location;
    const history = useHistory();

    function logout() {
        authApi.signout();
        history.push('/signin');
    }

    return (
      <div className='App'>
        <Navbar bg='dark' variant='dark'>
          <Container>
            <Nav className='me-auto'>
              <Nav.Link href='/users' active={location.pathname.includes('/users')}>
                Пользователи
              </Nav.Link>
              <Nav.Link href='/roles' active={location.pathname.includes('/roles')}>
                Роли
              </Nav.Link>
              <Nav.Link href='/access' active={location.pathname.includes('/access')}>
                Доступы
              </Nav.Link>
            </Nav>
            <Button onClick={logout}>Выйти</Button>
          </Container>
        </Navbar>
        <BrowserRouter>
          <Switch>
            {Object.entries(routes).map(([path, Component]) => (
                <Route path={path} component={Component} />
            ))}

            <Redirect to='/roles' />
          </Switch>
        </BrowserRouter>
      </div>
    );
}

export default App;
