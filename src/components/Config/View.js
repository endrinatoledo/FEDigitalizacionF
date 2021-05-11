import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Divider, Spin   } from 'antd';
import Form from './Form';
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;


const { Title } = Typography;

const View = (props) => {
    const [reload, setReload] = useState(0);
    const [config, setConfig] = useState(null)

    const fillData = async (batch) => {
        const result = (await axios.get("/api/v1/configByClientId/"+localStorage.getItem('client')) ).data
        setConfig(result)
    }
    useEffect(() => {
        setConfig(null)
        fillData()
      }, [reload]);
  let content = (
    <div >

        <Row>
          <Col span={24}>
            <Title level={4}>Configuración</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
          </Col>

        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
            {config == null ? <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> : <Form config={config} />}

          </Col>

        </Row>
        
        
        
        
      
    </div>
  );
  return content;
}

export default View;
