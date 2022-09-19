import axios from "axios";
import AuthService from "../services/auth.service";

const API_URL = "https://oneclick-backend-api.herokuapp.com/api/data/";

const currentUser = AuthService.getCurrentUser();

const saveData = (dataObj) => {
  const id = currentUser.id;
    return axios
      .post(API_URL + "saveData/"+id, dataObj)
      .then((response) => {
        
        return response.data;
      });
  };

  const getUserData = () => {
    const id = currentUser.id;
    return axios.get(API_URL + "getData/"+id).then((response) => {
        
      return response.data;
    });;
  };

  const DataService = {
    saveData,
    getUserData
  }
  
  export default DataService;
  