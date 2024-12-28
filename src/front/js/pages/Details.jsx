import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { Spinner } from "../component/Spinner.jsx";

const isCorrectType = (type) => {
    switch (true) {
        case type === "people":
        case type === "planets":
        case type === "starships":
            return true;
        default:
            return false;
    };
};

const suffixes = {
    // Character suffixes
    height: "cm",
    mass: "kg",
    // Planet suffixes
    diameter: "km",
    population: "habitants",
    surface_water: "%",
    rotation_period: "hours",
    orbital_period: "days",
    // Starships suffixes
    cost_in_credits: "cr",
    length: "m",
    crew: "members",
    max_atmosphering_speed: "km/h",
    cargo_capacity: "kg",
};

const normalize = (data) => {
    if (data === "n/a") return "N/A";

    if (data.match(/^[0-9]{4,}/g)) {
        const numBackwards = data.split("").reverse().join("").replaceAll(",", "");
        const numBackwardsWithSeparator = numBackwards.match(/.{1,3}/g).join(".");

        const numWithSeparator = numBackwardsWithSeparator.split("").reverse().join("");
        return numWithSeparator;
    }
    const capitalizedText = data[0].toUpperCase() + data.slice(1);
    return capitalizedText;
};

const transformKey = (key) => {
    let transformedKey = key.replaceAll("_", " ");
    transformedKey = normalize(transformedKey);

    return transformedKey;
};

export const Details = () => {
    const { actions } = useContext(Context);
    const params = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState("Recuperando datos...");
    const [imageUrl, setImageUrl] = useState("");

    const [pilots, setPilots] = useState("");

    useEffect(() => {
        setIsLoading(true)
        if (!isCorrectType(params.type)) {
            navigate("/not-found");
            return;
        }

        let type = params.type;
        if (type === "people") {
            type = "characters";
        }

        actions.starWarsApi.getImage(`${type}/${params.id}`).then((data) => {
            setImageUrl(data);
        });

        const loadPilots = async (arr) => {
            const pilotsToAdd = [];
            for (const pilot of arr) {
                await actions.starWarsApi.getWithUri(pilot).then((res) => {
                    const newPilot = ` ${res.result.properties.name}`;
                    pilotsToAdd.push(newPilot);
                })
            }
            return pilotsToAdd;
        }

        actions.starWarsApi.getDetails(`${params.type}/${params.id}`).then(async (data) => {
            setDetails(data);
            if (data.pilots !== undefined) {
                if (data.pilots.length === 0) {
                    setPilots("Unknown");
                }
                else {
                    setLoadingStatus("Estableciendo pilotos de esta nave...");
                    setPilots(await loadPilots(data.pilots));
                }
            }
            setIsLoading(false);
        });
    }, [params]);

    return (
        <div className="container mt-5">
            {isLoading
                ?
                <Spinner status={loadingStatus} />
                :
                <div className="card mb-3">
                    <div className="card-header bg-dark border-0">
                        <h2>{details.name}</h2>
                    </div>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={imageUrl} className="img-fluid rounded-start" alt={`${details.name}'s picture`} />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                {Object.entries(details).map((property) => {
                                    if (["name", "created", "updated", "edited"].includes(property[0]) || property[1].includes("https")) return;
                                    let suffix = suffixes[property[0]] ? suffixes[property[0]] : "";
                                    return (
                                        <p key={property[0]}>
                                            <b className="text-warning">{`${transformKey(property[0])}: `}</b>
                                            {`${property[0] === "pilots" ? (pilots.length === 0 ? "..." : pilots) : normalize(property[1])} ${suffix}`}
                                        </p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <Link to={`/${params.type}`} className="text-warning">Back</Link>
                    </div>
                </div>
            }
        </div>
    );
};
