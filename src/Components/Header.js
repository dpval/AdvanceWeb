import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
  <header>
    <h1 className="site-heading text-center text-faded d-none d-lg-block">
      <span className="site-heading-upper text-primary mb-3">A Free Bootstrap Business Theme</span>
      <span className="site-heading-lower">Business Casual</span>
    </h1>
  </header>
  {/* Navigation*/}
  <nav className="navbar navbar-expand-lg navbar-dark py-lg-4" id="mainNav">
    <div className="container">
      <a className="navbar-brand text-uppercase fw-bold d-lg-none" href="index.html">Start Bootstrap</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item px-lg-4"><Link className="nav-link text-uppercase" to="/home">Home</Link></li>
          <li className="nav-item px-lg-4"><Link className="nav-link text-uppercase" to="/contacts">Contacts</Link></li>
          <li className="nav-item px-lg-4"><a className="nav-link text-uppercase" href="products.html">Products</a></li>
          <li className="nav-item px-lg-4"><Link className="nav-link text-uppercase" to="/login">Logout</Link></li>
        </ul>
      </div>
    </div>
  </nav>
</div>

  );
}

export default Header;
