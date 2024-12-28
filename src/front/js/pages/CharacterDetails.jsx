import React from "react";
import { useParams } from "react-router-dom";

export const CharacterDetails = () => {
    const params = useParams();

    return (
        <div>Detalles personaje con id: {params.id}</div>
    )
}