
import React, {Fragment, useState} from 'react';
import { Row, Col, Select   } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form'
import {v4 as uuidv4} from 'uuid'
import RecipientList from './RecipientLis'

  const Addressee = (props) => {

    let add = {id: null, email: null}
    const {register, errors, handleSubmit} = useForm(); //form

    const [value, setValue] = useState("");
    

    const onSubmit = (data, e) => { //form

        add.id = uuidv4();
        add.email = data.email;
        props.setAddresseMail([
          ...props.AddresseMail,
          add
        ])
        e.target.reset();
    }

    return (
      <Fragment>
           
          <Row>
            <Col span={24}>
              
              <form onSubmit={handleSubmit(onSubmit)}> 
              <Row>
                <Col span={24} >
                  <input
                    placeholder="Ingrese email"
                    className="form-control mb-2"
                    name="email"
                    ref={register({
                      required: {
                        value: true,
                        message: "Email es requerido",
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Formato de email invalido",
                      },
                    })}
                  ></input>
                  {errors.email && (
                    <span className="text-danger text small d-block">
                      {errors.email.message}
                    </span>
                  )}                  
                </Col>
              </Row>
              </form> 
            </Col>
            
            </Row>
        
      </Fragment>
    );
}

export default Addressee

/*<Row>              
              <input
                    placeholder="Ingrese asunto"
                    className="form-control mb-2"
                    value={props.Subject} 
                    onChange={e => props.setSubject(e.target.value)}                    
                  ></input>
              </Row>*/