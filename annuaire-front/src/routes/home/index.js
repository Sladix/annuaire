import { h, Component } from 'preact';
import ContactList from '../../components/contactlist';
import ContactFields from '../../components/contactfields';
import style from './style';
import dataprovider from '../../utils/dataprovider';
import generateContact from '../../utils/generatecontact';

export default class Home extends Component {
	state = {
		contactAddHolder : {
			phone: "",
			firstName: "",
			lastName: ""
		},
		contactEditHolder: {
			phone: "",
			firstName: "",
			lastName: ""
		},
		contacts : [],
		filteredContacts : [],
		searchValue: "",
		sortField: "lastName",
		order:"asc",
		loading: true,
		offline: false
	};

	// Quand on monte l'app dans le dom, on récupère les données de l'api
	componentWillMount(){
		dataprovider.fetchContacts().then((response)=>{
			let sorted = this.sortContacts(response.data);
			this.setState({
				contacts : sorted,
				filteredContacts : [...sorted],
				loading: false
			})
		}).catch((e)=>{
			this.setState({
				contacts : [],
				filteredContacts : [],
				loading: false,
				offline: true
			})
		});
	}

	// Quand un input change, on change la valeur dans le state
	handleInputChange = e => {
    const target = event.target;
    const name = target.name;
		const holder = target.dataset.holder || false;
    let value = target.type === 'checkbox' ? target.checked : target.value;
		let key = name;
    // Holder represente un groupe de champs
		if(holder){
			value = {...this.state[holder],...{[name]: value}};
			key = holder;
		}
    this.setState({
      [key]: value
    });
  };

	// Néttoie un objet (utilisé pour néttoyer les holders)
	clean = obj => {
		let cleaned = {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				cleaned[key] = "";
			}
		}
		return cleaned;
	}

	// Trie les contacts avec la clef courante
	sortContacts = (contacts) => {
		contacts.sort((a,b)=>{
			if(a[this.state.sortField] && a[this.state.sortField].toLowerCase() < b[this.state.sortField].toLowerCase()) return -1;
	    if(a[this.state.sortField] && a[this.state.sortField].toLowerCase() > b[this.state.sortField].toLowerCase()) return 1;
	    return 0;
		});
		return contacts;
	}

	// Génère un contact pour peupler la base
	generateContact(e){
		e.preventDefault();
		let contact = generateContact();
		this.setState({
			contactAddHolder: contact
		});
	}

	// Effectue un appel à l'API pour ajouter un contact
	addContact = (e = false) => {
		if(e){
			e.preventDefault();
		}

		let newContact = {...this.state.contactAddHolder};
		if(newContact.phone.slice(0,4) == "0033"){
			newContact.phone = "+33"+newContact.phone.slice(4);
		}
		if(newContact.phone[0] == "0"){
			newContact.phone = "+33"+newContact.phone.slice(1);
		}

		this.setState({
			loading: true
		});
		dataprovider.addContact(newContact).then((response)=>{
			this.state.contacts.push(response.data);
			this.setState({
				contacts : this.state.contacts,
				contactAddHolder : this.clean(this.state.contactAddHolder)
			});
			this.updateFilteredList();
		}).catch((e)=>{
			this.setState({
				loading: false,
				offline: true
			});
		});

	};

	// Effectue un appel à l'API pour supprimer un contact
	deleteContact = (id,e) => {
		e.preventDefault();
		this.setState({
			loading: true
		});
		dataprovider.removeContact(id).then((response)=>{
			this.setState({
				contacts : [...this.state.contacts.filter((e)=>{ return e.id !== id; })]
			})
			this.updateFilteredList();
		}).catch((e)=>{
			this.setState({
				loading: false,
				offline: true
			});
		});
	}

	// Effectue un appel à l'API pour éditer un contact
	editContact(contactHolder){
		this.setState({
			loading: true
		});
		dataprovider.editContact(contactHolder).then((response)=>{
			let index = this.state.contacts.map((c)=>{return c.id}).indexOf(contactHolder.id);
			let newContacts = [...this.state.contacts];
			newContacts.splice(index,1,response.data);
			this.setState({
				contacts: newContacts
			});
			this.updateFilteredList();
		}).catch((e)=>{
			this.setState({
				loading: false,
				offline: true
			});
		});
	}

	// Met à jour la liste de contact affichée avec les filtres de l'état ou retourne la liste complète
	updateFilteredList(searchValue){
		this.setState({
			loading: false
		});
		if(searchValue && searchValue.length > 0){
			let filtered = this.state.contacts.filter((c)=>{
				var re = new RegExp(searchValue, 'gi');
				return c.firstName.match(re) || c.lastName.match(re) || c.phone.match(re);
			});
			this.setState({
				filteredContacts: this.sortContacts(filtered)
			});
		}else{
			this.setState({
				filteredContacts : this.sortContacts(this.state.contacts)
			})
		}
	}
	// Met à jour le champ de recherche et filtre la liste
	search = () => {
		this.setState({
			searchValue: this.state.searchValue
		});
		this.updateFilteredList(this.state.searchValue);
	}

	render({ }, state) {
		return (
			<div class={style.home}>
				<div class="container">
					<h1>Annuaire <small>({this.state.contacts.length} contacts)</small></h1>
					<form class={"container boxed "+style.submitForm} onSubmit={this.addContact}>
						<h2>Ajouter un contact</h2>
						<ContactFields
							holder={state.contactAddHolder}
							holderName="contactAddHolder"
							handleInputChange={this.handleInputChange.bind(this)} />
						<button class={style.submit} type="submit" class={style.submit} disabled={state.loading || (state.offline && !state.loading)}>Ajouter un contact</button>
						<button class={style.generate} onClick={(e)=>{this.generateContact(e)}} disabled={state.loading}>Générer un contact</button>
					</form>
					<form class={"container boxed "+style.searchForm} onSubmit={(e)=>{e.preventDefault();}}>
						<input
							name="searchValue"
							placeholder="Rechercher (par nom, prénom ou numéro)"
							value={state.searchValue}
							onKeyUp={(e)=>{this.handleInputChange(e); this.search();}}
							type="text"
							pattern="\w+" />
					</form>
					{
						state.loading &&
						<div class={style.loader}>
		          <span></span>
		          <span></span>
		          <span></span>
		        </div>
					}
					{ (state.offline && !state.loading) &&
						<p class={style.message+' fadeIn'}>
							<span class={style.i}></span>L'application n'arrive pas à joindre l'API, assurez-vous d'avoir lancé le serveur avec{' '}<code>php app/console server:run</code>
						</p>
					}
					<ContactList
						loading={state.loading}
						handleInputChange={this.handleInputChange.bind(this)}
						contacts={state.filteredContacts}
						editHandle={this.editContact.bind(this)}
						deleteHandle={this.deleteContact.bind(this)} />
				</div>
			</div>
		);
	}
}
