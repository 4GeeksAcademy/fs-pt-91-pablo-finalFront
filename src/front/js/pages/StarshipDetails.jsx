import React from "react";
import { useParams } from "react-router-dom";

export const StarshipDetails = () => {
    const params = useParams();

    return (
        <div>Detalles nave con id: {params.id}</div>
    )
}