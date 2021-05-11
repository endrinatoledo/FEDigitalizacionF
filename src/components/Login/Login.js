import React, { Component } from "react";
import "../../assets/css/login.css"
import Intelix from './Tabs/Intelix'
import Mayoreo from './Tabs/Mayoreo'
import { Tooltip, message } from 'antd'
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

class Login extends Component {
  constructor(props) {
    super(props);
    if(localStorage.getItem("org") === undefined){
      localStorage.setItem("org", 1);
    }
  };
  onClick (e){
    if(e === "1"){
      localStorage.setItem("org", 2);
    }else{
      localStorage.setItem("org", 1);
    }
    window.location.reload();
  }
  OnClick2 (){
    console.log()
    message.error('Este formulario se encuentra desactivado');
  }
    render() {
      return (
        <div className="register-photo">
            <div className="form-container">
                <div className="image-holder"></div>
                    <form method="post">
                        <div className="logo"></div>
                        <p className="text-center"><strong>Usuarios de {String(localStorage.getItem("org")) === "1" ? "Mayoreo" : "Intelix"}</strong></p>
                        <div className="form-group"><input className="form-control" type="email" name="email" placeholder="Correo"></input></div>
                        <div className="form-group"><input className="form-control" type="password" name="password" placeholder="Contraseña"></input></div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" type="button" onClick={()=>{this.OnClick2()}}><strong>Iniciar Sesión</strong></button>
                        </div>
                        <hr></hr>
                        {String(localStorage.getItem("org")) === "1" ? 
                          <Mayoreo/>
                        : 
                          <Intelix/>
                        }
                        <hr></hr>
                        
                        
                        <p style={{textAlign: "right", marginTop: "15px"}}><Tooltip title="Cambiar de organización">
                      <a onClick={()=>{this.onClick(String(localStorage.getItem("org")))}} style={{ margin: '0 8px' }}>
                        ¿Es usuario de {String(localStorage.getItem("org")) === "1" ? "Intelix" : "Mayoreo"}?
                        </a>
                      </Tooltip></p>
                        
                    </form>
                    
            </div>
        </div>
      );
    }
  }
export default Login;