import { Col, Container, NavDropdown, Navbar, Row } from 'react-bootstrap';
import './App.scss';
import "@fortawesome/fontawesome-free/js/all.js";
import { Route, Navigate, HashRouter, Routes, Outlet, NavLink } from 'react-router-dom';
import Home from 'components/Home/Home';
import { Book } from 'components/Book/Book';
import { Category } from 'components/Category/Category';
import bookShelf from 'images/bookshelf.png';
import { Login } from 'components/Login/Login';
import { isUserAuthenicated } from 'utils/auth';
import { Fragment, useState } from 'react';

function App() {

  const [userIsAuthenticated, setUserIsAuthenticated] = useState<boolean>(isUserAuthenicated());

  const onUserIsAuthenticated = () => {
    setUserIsAuthenticated(true);
  }

  const renderLogedInUser = () => {
    if (userIsAuthenticated) {
      const userName = localStorage.getItem("bookCatalogUserName");
      return <>
        <NavDropdown className='me-3' title={userName} id="logout">
          <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
        </NavDropdown>
      </>
    }
  }

  const logout = () => {
    localStorage.removeItem("bookCatalogToken");
    localStorage.removeItem("bookCatalogRefreshToken");
    localStorage.removeItem("bookCatalogUserName");
    setUserIsAuthenticated(false);

    window.location.hash = '/login'
  }

  const renderNavigationIfUserAuthenticated = () => {
    if (userIsAuthenticated) {
      return <>
        <NavLink to="/home">
          Home
        </NavLink>
        <NavLink to="/book">
          Books
        </NavLink>
        <NavLink
          to="/category">
          Categories
        </NavLink>
      </>
    }
    else {
      return <div className="fs-1">Welcome to Book Catalog</div>
    }
  }

  return (
    <>
      <HashRouter>
        <Fragment>
          <Navbar expand="sm" className={`d-flex justify-content-${userIsAuthenticated ? 'between' : 'center'} navbar navbar-light`} style={{ backgroundColor: '#6cadee' }}>
            <Navbar.Brand href="#/home">
              {userIsAuthenticated &&
                <img
                  src={bookShelf}
                  width="60"
                  height="60"
                  className="ms-3"
                  alt="logo"
                />
              }
            </Navbar.Brand>
            <div className="fs-2 navigationWrapper">
              {renderNavigationIfUserAuthenticated()}
            </div>
            {renderLogedInUser()}
          </Navbar>
          <Container fluid>
            <Row>
              <Col>
                <Routes>
                  <Route path='/' element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate replace to="/Book" />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/book' element={<Book />} />
                    <Route path='/category' element={<Category />} />
                    <Route path='*' element={<Home />} />
                  </Route>
                  <Route path='/login' element={<Login onUserIsAuthenticated={onUserIsAuthenticated} />} />
                </Routes>
              </Col>
            </Row>
          </Container>
        </Fragment>
      </HashRouter>
    </>
  );
}

export default App;

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("bookCatalogToken");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}