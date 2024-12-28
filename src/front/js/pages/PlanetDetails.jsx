import React from "react";
import { useParams } from "react-router-dom";

export const PlanetDetails = () => {
    const params = useParams();

    return (
        <div>Detalles planeta con id: {params.id}</div>
    )
}