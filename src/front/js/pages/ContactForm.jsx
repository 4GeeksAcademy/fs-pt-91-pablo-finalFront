import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const ContactForm = () => {

  const { actions } = useContext(Context)
  const navigate = useNavigate();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isEdit, setIsEdit] = useState(false)

  const params = useParams();

  useEffect(() => {
    if(params.id) {
      setIsEdit(true)
      actions.contactApi.getContact(params.id).then((contact) => {
        setName(contact.name)
        setEmail(contact.email)
        setPhone(contact.phone)
        setAddress(contact.address)
      });
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const dataToSend = {
      name: name,
      email: email,
      phone: phone,
      address: address
    }

    if(params.id) {
      actions.contactApi.updateContact(dataToSend, params.id)
    }
    else {
      actions.contactApi.addContact(dataToSend)
    }
    navigate("/contact-list")
  }
    return (
        <form className="container" action="submit">
            <h1 className="text-center">{isEdit ? 'Edit contact' : 'Add contact'}</h1>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full name</label>
              <input type="text" className="form-control" id="fullName" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input type="email" className="form-control" id="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone number</label>
              <input type="text" className="form-control" id="phone" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input type="text" className="form-control" id="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100" onClick={(event) => handleSubmit(event)}>Save</button>
            <Link to="/contact-list">
              {"Go back to contact list"}
            </Link>
        </form>
    );
};
