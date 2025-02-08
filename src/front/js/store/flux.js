const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: {},
			isLogged: false,
			alert: {text: '', background: '', visible: false},
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
			setFromLocalStorage: (type) => {
				const data = localStorage.getItem(type);
				setStore({ [type]: JSON.parse(data) })
			},
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`
				setStore({ alert: { text: '', background: '', visible: false } })
				const response = await fetch(uri, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				})
				if(!response.ok) {
					setStore({ alert: { text: 'Usuario o contraseña incorrectos', background: 'danger', visible: true } })
					return;
				}
				const data = await response.json()
				localStorage.setItem('accessToken', data.access_token)
				setStore({ 
					isLogged: true, 
					user: data.result 
				})
				return response
			},
			logout: () => {
				localStorage.clear()
				setStore({ user: {}, isLogged: false })
			},
			getUser: async(id) => {
				const uri = `${process.env.BACKEND_URL}/api/users/${id}`;
				const response = await fetch(uri, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('accessToken')}`
					}
				});

				if (!response.ok) {
					return;
				}

				const data = await response.json()
				return data.result;
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
					localStorage.setItem(type, JSON.stringify(data))
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
