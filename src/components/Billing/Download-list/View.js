import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin   } from 'antd';
import List from './List';
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const { Title } = Typography;

const View = (props) => {
    const [dataSource, setDataSource] = useState(null)

    const fillData = async (batch) => {
        const result = (await axios.get("/api/v1/donwloadByClient/"+localStorage.getItem('client')) ).data
        setDataSource(result)
    }
    useEffect(() => {
        setDataSource(null)
        fillData()
    }, []);
  let content = (
    <div >

        <Row>
          <Col span={24}>
            <Title level={4}>Facturas descargadas</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
          </Col>

        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
          {dataSource == null ? <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> : <List dataSource={dataSource} />}

          </Col>

        </Row>
        
        
        
        
      
    </div>
  );
  return content;
}

export default View;
