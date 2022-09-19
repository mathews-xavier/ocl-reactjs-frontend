import axios from "axios";
import AuthService from "../services/auth.service";

const transport = axios.create({
  withCredentials: true
})

const API_URL = "https://code-repo-mathew.herokuapp.com/api/data/";

const currentUser = AuthService.getCurrentUser();

const saveData = (dataObj) => {
  const id = currentUser.id;
    return transport
      .post(API_URL + "saveData/"+id, dataObj)
      .then((response) => {
        
        return response.data;
      });
  };

  const getUserData = () => {
    const id = currentUser.id;
    return transport.get(API_URL + "getData/"+id).then((response) => {
        
      return response.data;
    });;
  };

  const DataService = {
    saveData,
    getUserData
  } 
  
  export default DataService;
  