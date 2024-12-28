import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Spinner } from "../component/Spinner.jsx";

const isCorrectType = (type) => {
    switch (true) {
        case type === "people":
        case type === "planets":
        case type === "starships":
            return true;
        default:
            return false;
    }
}

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

}

const normalize = (str) => {
    if(str === "n/a") return "N/A"
    if(str.match(/[0-9]{3,}/g)) {
        const numBackwards = str.split("").reverse().join("")
        const numBackwardsWithSeparator = numBackwards.match(/.{1,3}/g).join(".")
        return numBackwardsWithSeparator.split("").reverse().join("")
    }
    return str[0].toUpperCase() + str.slice(1);
}

const transformKey = (key) => {
    let transformedKey = key.replace("_", " ");
    transformedKey = normalize(transformedKey)

    return transformedKey;
}

export const Details = () => {
    const { actions } = useContext(Context);
    const params = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if(!isCorrectType(params.type)) {
            navigate("/not-found");
            return;
        }

        let type = params.type;
        if(type === "people") {
            type = "characters"
        }

        actions.starWarsApi.getImage(`${type}/${params.id}`).then((data) => {
            setImageUrl(data)
        }) 

        actions.starWarsApi.getDetails(`${params.type}/${params.id}`).then((data) => {
            setDetails(data)
            setIsLoading(false)
        })


    }, [])
    return (
    <div className="container mt-5">
        {isLoading
            ?
            <Spinner />
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
                        if(["name", "created", "updated", "edited"].includes(property[0]) || property[1].includes("https")) return;
                        let suffix = suffixes[property[0]] ? suffixes[property[0]] : "";
                        return (
                            <p key={property[0]}><b>{transformKey(property[0])}:</b> {`${normalize(property[1])} ${suffix}`}</p>
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
    </div>)
    ;
}