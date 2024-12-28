const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			contacts: [],
			people: [],
			planets: [],
			starships: [],
			favorites: [],
			baseContactApiUrl: "https://playground.4geeks.com/contact/agendas",
			baseStarWarsImageUrl: "https://starwars-visualguide.com/assets/img",
			baseSwapiUrl: "https://www.swapi.tech/api",
			slug: "spain-91-pablo"
		},
		actions: {
			setFavorite: (newFavorite) => {
				setStore({favorites: [...getStore().favorites, newFavorite]});
			},
			removeFavorite: (toRemoveRedirect) => {
				setStore({favorites: getStore().favorites.filter((favorite) => favorite.redirect !== toRemoveRedirect)});
			},
			contactApi: {
				getContactList: async() => {
					const uri = `${getStore().baseContactApiUrl}/${getStore().slug}`;

					const response = await fetch(uri);
					if(!response.ok) {
						await fetch(uri, {
							method: 'POST'
						}).then(async(res) => {
							if(res.ok) {
								await getActions().contactApi.getContactList();
							}
						})
						return;
					}
					const data = await response.json();
					setStore({contacts: data.contacts});
				},
				getContact: async(id) => {
					const uri = `${getStore().baseContactApiUrl}/${getStore().slug}/contacts`;
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Contact not found");
						return;
					}
					const data = await response.json();
					const contact = Object.values(data.contacts).filter((contact) => contact.id === parseInt(id))[0];
					return contact;
				},
				addContact: async(dataToSend) => {
					const uri = `${getStore().baseContactApiUrl}/${getStore().slug}/contacts`;
					const options = {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(dataToSend)
					};
					const response = await fetch(uri, options);
					if(!response.ok) {
						console.log("Error creating contact");
						return;
					}
					getActions().contactApi.getContactList();
				},
				updateContact: async(dataToSend, id) => {
					const uri = `${getStore().baseContactApiUrl}/${getStore().slug}/contacts/${id}`;
					const options = {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(dataToSend)
					};
					const response = await fetch(uri, options);
					if(!response.ok) {
						console.log("Error updating contact");
						return;
					}
					getActions().contactApi.getContactList();
				},
				deleteContact: async(id) => {
					const uri = `${getStore().baseContactApiUrl}/${getStore().slug}/contacts/${id}`;
					const options = {
						method: 'DELETE'
					};
					const response = await fetch(uri, options);
					if(!response.ok) {
						console.log("Error removing contact");
						return;
					}
					getActions().contactApi.getContactList();
				}
			},
			starWarsApi: {
				getWithUri: async(uri) => {
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Not found");
						return;
					}
					const data = await response.json();
					return data;
				},
				get: async(type, optionalData) => {
					const uri = `${getStore().baseSwapiUrl}/${type}?${optionalData}`;
					const data = await getActions().starWarsApi.getWithUri(uri);
					setStore({ [type]: data })
				},
				getImage: async (extraUrlData) => {
					const uri = `${getStore().baseStarWarsImageUrl}/${extraUrlData}.jpg`;
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Image not found");
						return "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
					}
					return response.url;
				},
				getDetails: async (extraUrlData) => {
					const uri = `${getStore().baseSwapiUrl}/${extraUrlData}`;
					const data = await getActions().starWarsApi.getWithUri(uri);
					return data.result.properties;
				},
				clear: (type) => {
					setStore({ [type]: [] })
				}
			}
		}
	};
};

export default getState;
