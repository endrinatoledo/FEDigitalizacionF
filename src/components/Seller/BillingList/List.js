import React, {useState, useEffect}  from 'react';
import { Row, Col, Typography, Divider, Descriptions, Select    } from 'antd';
import TableList from './tableList';
import { PropertySafetyFilled } from '@ant-design/icons';
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
const { Title } = Typography;

const List = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const fillTable = async () => {
    const result = (await axios.get("/api/v1/allBatchsByClient/"+localStorage.getItem("client")) ).data
    setDataSource((result === "Not Data" ? [] : result ))
  }
  useEffect(() => {
    fillTable()
  }, []);
  let content = (
    <div style={{height: "100vh"}}>

        <Row>
          <Col span={24}>
            <Title level={4}>Listado de facturas</Title>           
          </Col>
          
        </Row>
        <Row>
        <Col span={24}>
        <Descriptions>
          <Descriptions.Item label="Lote de facturas">
            <Select placeholder="Lote" defaultValue={"all"} onChange={(val)=>setSelectedBatch(val)}  style={{ minWidth: "20vw"}}>
            <Select.Option value="all">Todos los lotes</Select.Option>
              {dataSource.map(el =>{return (<Select.Option value={el.bthId}>Lote: {el.initInv + ' - ' + el.lastInv}</Select.Option>)})}
          </Select>
          </Descriptions.Item>
        </Descriptions>         
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
            <TableList selectedBatch={selectedBatch}/>
            </Col>

        </Row>
        

    </div>
  );
  return content;
}

export default List;
