import React, { useContext, useEffect, useState } from "react";
import { Card } from "../component/Card.jsx";
import { Context } from "../store/appContext.js";
import { Spinner } from "../component/Spinner.jsx";

export const CharactersList = () => {
    const {store, actions} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        actions.starWarsApi.getCharacters().then(() => setIsLoading(false));
    }, [])

    return (
        <div className="container-fluid mt-5">
            {isLoading 
            ?
            <Spinner />
            :
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 gap-5 justify-content-center">
                {store.characters.map((character) => 
                    <Card 
                        key={`character_${character.uid}`} 
                        type="characters" 
                        name={character.name} 
                        uid={character.uid} 
                    />
                )}
            </div>
            }
        </div>
    )
}