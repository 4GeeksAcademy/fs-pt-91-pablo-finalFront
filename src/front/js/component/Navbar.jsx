import React from "react";
import { Link } from "react-router-dom";
import starWarsLogo from "../../img/logo-star-wars.png";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
			<div className="container-fluid">
				<Link to="/" className="navbar-brand">
					<img src={starWarsLogo} alt="Star wars logo" width="100" />
				</Link>
				<div className="collapse navbar-collapse">
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link to="/people" className="nav-link">
								<span>Characters</span>
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/planets" className="nav-link">
								<span>Planets</span>
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/starships" className="nav-link">
								<span>Starships</span>
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/contact-list" className="nav-link">
								<span>Contacts</span>
							</Link>
						</li>
					</ul>
				</div>
				<button className="nav-item btn btn-outline-warning dropdown-toggle" data-bs-toggle="dropdown" role="button">Favorites </button>
				<div className="dropdown-menu">
					<span className="dropdown-item text-end">TODO: </span>
				</div>
			</div>
		</nav>
	);
};
