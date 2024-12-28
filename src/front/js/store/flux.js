const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			contacts: [],
			characters: [],
			planets: [],
			starships: [],
			favorites: [],
			baseContactApiUrl: "https://playground.4geeks.com/contact/agendas",
			baseStarWarsImageUrl: "https://starwars-visualguide.com/assets/img",
			baseSwapiUrl: "https://www.swapi.tech/api",
			slug: "spain-91-pablo"
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			setFavorite: (newFavorite) => {
				setStore({favorites: [...getStore().favorites, newFavorite]})
				
			},
			removeFavorite: (toRemoveRedirect) => {
				setStore({favorites: getStore().favorites.filter((favorite) => favorite.redirect !== toRemoveRedirect)})
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
					const data = await response.json()
					setStore({contacts: data.contacts})
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
					return contact
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
					const response = await fetch(uri, options)
					if(!response.ok) {
						alert("Error")
					}
					getActions().contactApi.getContactList()
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
					const response = await fetch(uri, options)
					if(!response.ok) {
						alert("Error")
					}
					getActions().contactApi.getContactList()
				},
				deleteContact: async(id) => {
					const uri = `${getStore().baseContactApiUrl}/${getStore().slug}/contacts/${id}`;
					const options = {
						method: 'DELETE'
					};
					const response = await fetch(uri, options)
					if(!response.ok) {
						alert("Error")
					}
					getActions().contactApi.getContactList()
				}
			},
			starWarsApi: {
				get: async(uri) => {
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Not found");
						return;
					}
					const data = await response.json();
					return data;
				},
				getImage: async (extraUrlData) => {
					const uri = `${getStore().baseStarWarsImageUrl}/${extraUrlData}.jpg`
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Image not found");
						return "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
					}
					return response.url;
				},
				getCharacters: async (optionalData) => {
					const uri = `${getStore().baseSwapiUrl}/people?${optionalData}`;
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Characters not found");
						return;
					}
					const data = await response.json();
					setStore({ characters: data })
				},
				getPlanets: async (optionalData) => {
					const uri = `${getStore().baseSwapiUrl}/planets?${optionalData}`;
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Characters not found");
						return;
					}
					const data = await response.json();
					setStore({ planets: data })
				},
				getStarships: async (optionalData) => {
					const uri = `${getStore().baseSwapiUrl}/starships?${optionalData}`;
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Characters not found");
						return;
					}
					const data = await response.json();
					setStore({ starships: data })
				},
				getDetails: async (extraUrlData) => {
					const uri = `${getStore().baseSwapiUrl}/${extraUrlData}`;
					const response = await fetch(uri);
					if(!response.ok) {
						console.log("Character details not found");
						return;
					}
					const data = await response.json();
					return data.result.properties;
				},
				clear: (type) => {
					setStore({ [type]: [] })
				}
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
