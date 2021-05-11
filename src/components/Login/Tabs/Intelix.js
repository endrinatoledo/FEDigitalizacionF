import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
//import "../../assets/css/login.css"
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const responseGoogle = async (response) => {
  if(response){
    if(response.profileObj){
      const user = await axios.get('/api/v1/usersEmail/'+response.profileObj.email)
      if(user.data.length){
        if(user.data[0].usrStatus === "0"){
          localStorage.setItem("email", response.profileObj.email);
          localStorage.setItem("name", user.data[0].usrName + " " + user.data[0].usrLastName);
          localStorage.setItem("client", user.data[0].clients.cliId);
          localStorage.setItem("clientName", user.data[0].clients.cliName);
          localStorage.setItem("rol", user.data[0].usrRol);
          localStorage.setItem("sellerCode", user.data[0].usrSellerCode)
          localStorage.setItem("notReg", false);
        }else{
          localStorage.setItem("notReg", true);
          localStorage.setItem("status", true);
          }
      }else{
        localStorage.setItem("notReg", true);
        }
      window.location.reload();
      }
    }
}

class Login extends Component {
    constructor(props) {
      super(props);
    };
      render() {
        return (
            <GoogleLogin 
            className="btn btn-google btn-block"
            clientId={process.env.REACT_APP_CLIENT_ID_INTELIX}
            buttonText="Iniciar Sesión"
            onSuccess={responseGoogle}
            />
        );
      }
    }
  export default Login;