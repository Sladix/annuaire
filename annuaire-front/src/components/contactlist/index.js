import { h, Component } from 'preact';
import style from './style';
import Contact from '../../components/contact';

export default class ContactList extends Component{
  render({contacts, deleteHandle, editHandle, handleInputChange, loading, children},state){
    return (
      <div class="fadeIn boxed">
				{contacts.map((c)=>
					<Contact contact={c} deleteHandle={deleteHandle} loading={loading} editHandle={editHandle} onKeyUp={handleInputChange}/>
				)}
        {children}
      </div>
    )
  }
}
