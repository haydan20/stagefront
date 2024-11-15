import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify'; 
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let avatar = localStorage.getItem("avatar") || '';

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <svg width="101" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" className="chakra-icon css-z5cq7n"><path d="M43.453 13.359c.79.307 1.479.829 1.99 1.508.458.65.695 1.43.676 2.225a4.036 4.036 0 0 1-1.194 3.034 4.86 4.86 0 0 1-5.832.326 4.087 4.087 0 0 1-1.462-2.345l1.462-.724c.136.708.473 1.362.972 1.88a2.427 2.427 0 0 0 1.713.633c.72.031 1.423-.22 1.962-.702a2.4 2.4 0 0 0 .75-1.834 2.482 2.482 0 0 0-.529-1.582 3.912 3.912 0 0 0-1.573-1.144l-1.648-.707a4.72 4.72 0 0 1-2.019-1.46 3.514 3.514 0 0 1-.657-2.142 3.072 3.072 0 0 1 1.073-2.404 3.988 3.988 0 0 1 2.74-.95 4.1 4.1 0 0 1 2.11.522c.61.359 1.098.895 1.4 1.537l-1.332.856a3.45 3.45 0 0 0-1.02-1.173 2.191 2.191 0 0 0-1.28-.39 2.064 2.064 0 0 0-1.49.558 1.897 1.897 0 0 0-.573 1.424c-.009.46.149.906.444 1.256.383.415.855.736 1.38.94l1.937.858ZM53.196 20.928V8.846h-3.833V7.301h9.28v1.545h-3.818v12.081h-1.629ZM65.916 10.345l-2.16 5.017h4.315l-2.155-5.017Zm0-3.583 6.16 14.166h-1.749l-1.76-4.183h-5.291l-1.76 4.183h-1.75l6.15-14.166ZM83.168 13.891h5.59v.456a6.982 6.982 0 0 1-1.814 5.082 6.61 6.61 0 0 1-4.953 1.862 7.931 7.931 0 0 1-1.823-.206 6.593 6.593 0 0 1-1.593-.595 6.477 6.477 0 0 1-2.573-2.541 7.462 7.462 0 0 1-.907-3.695 8.345 8.345 0 0 1 .537-3.072 6.753 6.753 0 0 1 1.637-2.42 6.104 6.104 0 0 1 2.13-1.321 7.718 7.718 0 0 1 2.685-.447 7.498 7.498 0 0 1 3.388.717 6.01 6.01 0 0 1 2.38 2.14l-1.352 1.09a4.942 4.942 0 0 0-1.824-1.85 5.029 5.029 0 0 0-2.537-.624 4.955 4.955 0 0 0-3.832 1.6 5.945 5.945 0 0 0-1.472 4.189 5.578 5.578 0 0 0 1.49 4.001 5.07 5.07 0 0 0 3.814 1.564 4.826 4.826 0 0 0 3.388-1.238 4.691 4.691 0 0 0 1.509-3.24h-3.87l.002-1.452ZM93.742 20.928V7.3h7.147v1.48h-5.536v3.909h5.536v1.508h-5.536v5.221h5.536v1.508h-7.147ZM15.656.262l-3.033 1.76 2.965 1.722 3.033-1.761L15.656.262Zm-5.36 3.11L.891 8.832v14.443l5.78 3.353 3.032-1.761 9.068-5.264v-3.448l-.968-.563h.006l-5.955-3.458 9.098-5.282 2.982 1.731V19.39l-9.502 5.516 2.953 1.727 9.41-5.462V6.727l-5.78-3.355-3.032 1.76-9.068 5.265v3.443l.968.563h-.005l5.955 3.459-9.1 5.286-2.981-1.732V10.614L13.256 5.1l-2.96-1.728Zm1.795 22.887L9.06 28.02l2.964 1.721 3.033-1.76-2.965-1.722Z" fill="currentColor"></path></svg>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Gestão de Processos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/oraculo">Oráculo</Link>
              </li>


            </ul>
            <div className="dropdown">
              <a
                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={avatar}
                  className="rounded-circle"
                  height="25"
                  alt="Avatar"
                  loading="lazy"
                  style={{ height: "46px", width: "46px" }}
                />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
                <li><Link className="dropdown-item" to="#">Sair</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>


      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
