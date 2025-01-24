"use client";
import 'bootstrap/dist/css/bootstrap.min.css'

import "../../app/globals.css"
// import "../../public/assets/css/style.css"

import React from 'react'



function Header() {

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light ">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Construction Monitoring</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/jobcreate">Job create</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/billcreate">Bill create</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/pocreate">PO create</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/jobquery">Job query</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/poquery">P.O. query</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/billquery">Bill query</a>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li> */}
                            <li className="nav-item">
                                <a className="nav-link disabled" href="#" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                        {/*  <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form> */}
                    </div>
                </div>
            </nav>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
                crossOrigin="anonymous"
            ></script>
        </>
    )
}

export default Header;
