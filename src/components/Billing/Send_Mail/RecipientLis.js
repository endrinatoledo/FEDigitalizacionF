import React, {Fragment, useState} from 'react';
import style from '../../../assets/css/Send_Mail.css'
import { CloseCircleOutlined } from '@ant-design/icons';
import {Row, Col, Tag } from 'antd';



const RecipientList = (props) => {
    
    

    return(
        <Fragment>
            <div className="div-addresse">
                {props.AddresseMail.map((item) => (
                    <Tag className='email' key={item.id} >
                        <Row>
                            <Col span={23}> <h6>{item.email} </h6></Col>
                            <Col span={1}> <a><CloseCircleOutlined onClick={() => {props.deleteItem(item.id)}}/></a> 
                            </Col>
                        </Row>
                    </Tag>
                ))}  
            </div>
                      
        </Fragment>
    );
}

export default RecipientList