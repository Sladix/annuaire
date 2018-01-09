import { h, Component } from 'preact';
import ContactFields from '../contactfields';
import style from './style'

export default class Contact extends Component{
  state = {
    editing: false,
    holder: {
      firstName:"",
      lastName:"",
      phone:""
    },
    init: false
  }

  constructor(){
    super();
    this.contact = {};
  }

  toggleEdit(evt){
    evt.preventDefault();
    this.setState({
      editing: !this.state.editing
    });
  }

  // Will automaticaly update the state property with input value
  handleInputChange = e => {
    const target = event.target;
    const name = target.name;
		const holder = target.dataset.holder || false;
    let value = target.type === 'checkbox' ? target.checked : target.value;
		let key = name;
    // Holder represent a group of fields
		if(holder){
			value = {...this.state[holder],...{[name]: value}};
			key = holder;
		}

    this.setState({
      [key]: value
    });
  };

  // Solution found to init the state holder with datas
  init(contact){
    this.setState({
      holder : {...contact},
      init : true,
      color: this.getColorFromLetter(contact.lastName[0])
    });
  }

  cancelHandle(evt){
    this.setState({
      init : false
    });
    this.toggleEdit(evt);
  }

  // When the user validates, the parent Home will update props
  validateHandle(callback,e){
    e.preventDefault();
    callback({...this.state.holder});
    this.cancelHandle(e);
  }

  // The new props are then used as the holder
  componentWillReceiveProps({ contact }){
    // If we already are editing a contact, we don't want to get it's original props but continue to edit
    if(!this.state.editing)
      this.init(contact);
  }

  // Récupère la couleur en fonction de la lettre
  getColorFromLetter(letter){
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const step = 360/alphabet.length;


    let i = alphabet.indexOf(letter.toLowerCase());
    let hue = Math.ceil((i+1)*step);
    return "hsl("+hue+",80%,50%);";
  }

  render({ contact , deleteHandle, editHandle, loading }, state){
    if(!state.init){
      this.init(contact);
    }
    return (
      <form onSubmit={(e)=>{this.validateHandle(editHandle,e)}} class={style.contact+' fadeIn'}>
        { !state.editing &&
          <div>
            <div class={style.fl} style={"background-color:"+state.color}>
              {state.holder.lastName[0].toUpperCase()}
            </div>
            <div class={style.name}>
              <p><b>Nom : </b>{state.holder.lastName}</p>
              <p><b>Prénom : </b>{state.holder.firstName}</p>
            </div>
            <p class={style.phone}><b>Téléphone : </b>{state.holder.phone}</p>
          </div>
        }
        { state.editing &&
          <div>
            <ContactFields
  						holder={state.holder}
  						holderName="holder"
  						handleInputChange={this.handleInputChange.bind(this)} />
          </div>
        }
        <div class={style.actions}>
          { !state.editing &&
            <div>
              <button onClick={(e)=>{deleteHandle(contact.id,e)}} disabled={loading}>Supprimer</button>
              <button onClick={(e)=>{this.toggleEdit(e)}} disabled={loading}>Éditer</button>
              <a class="btn" href={"tel:"+state.holder.phone}>Appeler</a>
            </div>
          }
          { state.editing &&
            <div>
              <button disabled={loading}>Valider</button>
              <button onClick={(e)=>{this.cancelHandle(e)}} disabled={loading}>Annuler</button>
            </div>
          }
        </div>
      </form>
    )
  }
}
