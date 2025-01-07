import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

export const Home = () => {
	const { actions } = useContext(Context);
	const [charactersImage, setCharactersImage] = useState("");
	const [planetsImage, setPlanetsImage] = useState("");
	const [starshipsImage, setStarshipsImage] = useState("");

	useEffect(() => {
		actions.starWarsApi.getImage('characters/1').then((data) => setCharactersImage(data));
		actions.starWarsApi.getImage('planets/2').then((data) => setPlanetsImage(data));
		actions.starWarsApi.getImage('starships/10').then((data) => setStarshipsImage(data));
	}, []);

	return (
		<div className="container-fluid mt-5">
			<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 gap-5 justify-content-center">
				<div className="card col p-0">
					<img src={charactersImage} className="card-img-top w-100" alt={`Characters`} />
					<div className="card-body d-flex flex-column justify-content-end">
						<h5 className="card-title">Characters</h5>
						<div className="d-flex justify-content-between">
							<Link to={`./people`}>
								<button type="button" className="btn btn-primary">Go to characters list</button>
							</Link>
						</div>
					</div>
				</div>

				<div className="card col p-0">
					<img src={planetsImage} className="card-img-top w-100" alt={`Planets`} />
					<div className="card-body d-flex flex-column justify-content-end">
						<h5 className="card-title">Planets</h5>
						<div className="d-flex justify-content-between">
							<Link to={`./planets`}>
								<button type="button" className="btn btn-primary">Go to planets list</button>
							</Link>
						</div>
					</div>
				</div>

				<div className="card col p-0">
					<img src={starshipsImage} className="card-img-top w-100" alt={`Characters`} />
					<div className="card-body d-flex flex-column justify-content-end">
						<h5 className="card-title">Starships</h5>
						<div className="d-flex justify-content-between">
							<Link to={`./starships`}>
								<button type="button" className="btn btn-primary">Go to starships list</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
