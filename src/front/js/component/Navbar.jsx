import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Contact list</span>
				</Link>
				<Link to="/add-contact">
					<button className="nav-item btn btn-primary text-white mb-0 h1">Add contact</button>
				</Link>
			</div>
		</nav>
	);
};
