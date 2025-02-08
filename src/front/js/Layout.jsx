import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home.jsx";
import injectContext from "./store/appContext";

import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import { ContactForm } from "./pages/ContactForm.jsx";
import { ContactList } from "./pages/ContactList.jsx";
import { CharactersList } from "./pages/CharactersList.jsx";
import { PlanetsList } from "./pages/PlanetsList.jsx";
import { StarshipsList } from "./pages/StarshipsList.jsx";
import { Details } from "./pages/Details.jsx";
import { Login } from "./pages/Login.jsx";
import { Alert } from "./component/Alert.jsx";
import { UserDetails } from "./pages/UserDetails.jsx";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <Navbar />
                <Alert />
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route element={<Login />} path="/login" />
                    <Route element={<UserDetails />} path="/settings" />

                    <Route element={<CharactersList />} path="/people" />
                    <Route element={<PlanetsList />} path="/planets" />
                    <Route element={<StarshipsList />} path="/starships" />

                    <Route element={<Details />} path="/:type/:id" />

                    <Route element={<ContactList />} path="/contact-list" />
                    <Route element={<ContactForm />} path="/add-contact" />
                    <Route element={<ContactForm />} path="/add-contact/:id" />
                    
                    <Route element={<h1>Not found!</h1>} path="*" />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
