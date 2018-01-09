import { h, Component } from 'preact';
import style from './style'
export default class ContactFields extends Component{
  render({ handleInputChange, holder, holderName },sate){
    return(
      <div>
        <input
          name="lastName"
          data-holder={holderName}
          placeholder="Nom"
          value={holder.lastName}
          onKeyUp={handleInputChange}
          type="text"
          autocomplete="off"
          pattern="\D+"
          required />
        <input
          name="firstName"
          data-holder={holderName}
          placeholder="Prénom"
          value={holder.firstName}
          onKeyUp={handleInputChange}
          type="text"
          autocomplete="off"
          pattern="\D+"
          required />
        <input
          name="phone"
          data-holder={holderName}
          placeholder="Téléphone"
          autocomplete="off"
          value={holder.phone}
          title="Format +33608080808 ou 0608080808 ou 0033608080808"
          onKeyUp={handleInputChange}
          type="text"
          pattern="^(?:0|\+33\s?|0033\s?)[1-79](?:[\.\-\s]?\d\d){4}$"
          required />
      </div>
    )
  }
}
