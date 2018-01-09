import axios from 'axios';

class DataProvider{
  constructor(){
      this.apiUrl = "http://localhost:8000/";
  }

  fetchContacts(){
    return axios.get(this.apiUrl+'contacts.json');
  }

  addContact(holder){
    return axios({
      method: 'POST',
      url: this.apiUrl+'contacts.json',
      data: {
        contact: holder
      }
    });
  }

  removeContact(id){
    return axios({
      method: 'DELETE',
      url: this.apiUrl+'contacts/'+id+'.json'
    })
  }

  editContact(holder){
    return axios({
      method: 'PUT',
      url: this.apiUrl+'contacts/'+holder.id+'.json',
      data : {
        contact : holder
      }
    })
  }

}

export default new DataProvider();
