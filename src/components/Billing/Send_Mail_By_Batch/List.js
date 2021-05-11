import React, {useState, useEffect} from 'react';
import { Row, Col, Typography, Divider, Descriptions , Select    } from 'antd';
import TableList from './tableList';
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const { Title } = Typography;

const List = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [reload, setReload] = useState('')
  const fillTable = async () => {
    const result = (await axios.get("/api/v1/batchsToSendByClient/"+localStorage.getItem("client")) ).data
    setDataSource((result === "Not Data" ? [] : result ))
  }
  useEffect(() => {
    setReload('')
    setSelectedBatch('')
    fillTable()
  }, [reload]);

  let content = (
    <div style={{height: "100vh"}}>

        <Row>
          <Col span={24}>
            <Title level={4}>Envío de correos en lotes - Lotes sin enviar</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 15 }} />
          </Col>

        </Row>
        <Row justify="start">
        <Col span={24}>
        <Descriptions>
          <Descriptions.Item label="Lote de facturas">
            <Select placeholder="Lote" defaultValue={null} onChange={(val)=>setSelectedBatch(val)} style={{ minWidth: "200px"}}>
              {dataSource.map(el =>{
                if(el.bthSended === "false"){
                  return (<Select.Option value={el.bthId}>Lote: {el.initInv + ' - ' + el.lastInv}</Select.Option>)
                }else{
                  return null;
                }
              })}
          </Select>
          </Descriptions.Item>
        </Descriptions>         
          </Col>
        
        

        </Row>

        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>

            <TableList selectedBatch={selectedBatch} fillParent={setReload} />

          </Col>

        </Row>
        
        
        
        
      
    </div>
  );
  return content;
}

export default List;
