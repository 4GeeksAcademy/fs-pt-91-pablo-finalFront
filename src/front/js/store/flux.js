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
			baseUrl: "https://playground.4geeks.com/contact/agendas",
			slug: "spain-91-pablo"
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			contactApi: {
				getContactList: async() => {
					const uri = `${getStore().baseUrl}/${getStore().slug}`;

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
					const uri = `${getStore().baseUrl}/${getStore().slug}/contacts`;
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
					const uri = `${getStore().baseUrl}/${getStore().slug}/contacts`;
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
					const uri = `${getStore().baseUrl}/${getStore().slug}/contacts/${id}`;
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
					const uri = `${getStore().baseUrl}/${getStore().slug}/contacts/${id}`;
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
