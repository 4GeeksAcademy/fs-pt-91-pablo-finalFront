import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const ContactList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
    const [deleteContact, setDeleteContact] = useState({name: "", email: "", phone: "", address: "", id: -1});

    const handleShowModal = (contact) => {
        setDeleteContact(contact)
    }
    const handleDelete = () => {
        actions.contactApi.deleteContact(deleteContact.id)
    }

    return(
        <div className="container mt-3">
            <Link to="/add-contact">
                <button className="btn btn-primary mb-2">Add contact</button>
            </Link>
            {store.contacts.length === 0 
            ?
            <p className="text-center">No tienes contactos</p> 
            :
            store.contacts.map((contact) => {
                const random = Math.floor(Math.random() * 10) + 1
                const manOrWoman = random >= 5 ? 'men' : 'women'
                const randomImageUrl = `https://randomuser.me/api/portraits/${manOrWoman}/${contact.id}.jpg`

                return (
                <div key={contact.id} className="card bg-secondary mb-3">
                    <div className="row g-0 align-items-center">
                        <div className="col-md-2 pe-2">
                            <img src={randomImageUrl} className="img-fluid rounded-circle" alt="..." />
                        </div>
                        <div className="col-md-4">
                            <div className="card-body">
                                <h5 className="card-title">{contact.name}</h5>
                                <p className="card-text d-flex align-items-center gap-3">
                                    <i className="fa-solid fa-location-dot"></i> 
                                    {contact.address}
                                </p>
                                <p className="card-text d-flex align-items-center gap-3">
                                    <i className="fa-solid fa-phone"></i> 
                                    {contact.phone}
                                </p>
                                <p className="card-text d-flex align-items-center gap-3">
                                    <i className="fa-solid fa-envelope"></i> 
                                    {contact.email}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end px-2 gap-2">
                            <button className="btn" onClick={() => navigate(`edit-contact/${contact.id}`)}><i className="fa-solid fa-pencil"></i></button>
                            <button className="btn text-danger" data-bs-toggle="modal" data-bs-target="#deleteContactModal" onClick={() => handleShowModal(contact)}><i className="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                )
            })
            }
            <div className="modal fade" id="deleteContactModal" tabIndex="-1" aria-labelledby="deleteContactModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                      <div className="modal-content">
                          <div className="modal-header justify-content-between">
                                <h1 className="modal-title fs-5" id="deleteContactModalLabel">Modal title</h1>
                                <button type="button" className="btn-close m-0" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"></span>
                                </button>
                          </div>
                          <div className="modal-body">
                            ¿Seguro que quieres eliminar a {<strong>{deleteContact.name}</strong>} de tu lista de contactos? Esta acción es irreversible.
                          </div>
                          <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDelete()} data-bs-dismiss="modal">Borrar</button>
                          </div>
                      </div>
                </div>
            </div>
        </div>
    )
}