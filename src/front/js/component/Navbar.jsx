import React, { useContext } from "react";
import { Link } from "react-router-dom";
import starWarsLogo from "../../img/logo-star-wars.png";
import { Context } from "../store/appContext.js";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	const handleRemoveFavorite = (toRemoveRedirect) => {
		actions.removeFavorite(toRemoveRedirect)
	};

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
				<button className="nav-item btn btn-outline-warning dropdown-toggle position-relative" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
					{'Favorites '}
					<span className="badge position-absolute top-0 start-0 translate-middle rounded-circle bg-warning text-dark">{store.favorites.length}</span>
				</button>
				<div className="dropdown-menu">
					{
						store.favorites.length === 0
							?
							<span className="dropdown-item text-end">You don't have favorites</span>
							:
							store.favorites.map((favorite) =>
								<div key={favorite.redirect} className="dropdown-item text-end d-flex justify-content-between align-items-center">
									<Link className="dropdown-link" to={`./${favorite.redirect}`}>
										{favorite.label}
									</Link>
									<button className="btn text-danger" onClick={() => handleRemoveFavorite(favorite.redirect)}><i className="fa-solid fa-trash"></i></button>
								</div>
							)
					}
				</div>
			</div>
		</nav>
	);
};
