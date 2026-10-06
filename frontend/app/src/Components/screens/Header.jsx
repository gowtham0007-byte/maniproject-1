import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <LinkContainer to="/">
            <Link className="navbar-brand">ELECTRICITY BOARD</Link>
          </LinkContainer>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
            fdprocessedid="29v9h7"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <LinkContainer to="/">
                  <Link className="nav-link active">Home</Link>
                </LinkContainer>
              </li>

              <li className="nav-item">
                <LinkContainer to="/StatisticsCollection">
                  <Link className="nav-link">Dashboard Statistics</Link>
                </LinkContainer>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
