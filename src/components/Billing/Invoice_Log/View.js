import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Divider, Spin   } from 'antd';
import List from './List';
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const { Title } = Typography;

const View = (props) => {
    const [dataSource, setDataSource] = useState(null)
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [reload, setReload] = useState(true)
    const fillData = async (batch) => {
        let data = [];

        const result = (await axios.get("/api/v1/emailInfoByClient/"+localStorage.getItem('client')+`?read=false&page=${page-1}&limit=${size}`) ).data
        if(result.count !== 0){
          setTotal(result.count)
          for (let index = 0; index < result.rows.length; index++) {
            
              data.push({
              key: index, 
              fecha: result.rows[index].dataValues.erDate,
              totalFiles:result.rows[index].dataValues.erTotalFiles, 
              failedFiles:result.rows[index].dataValues.erFailed, 
              correctFiles:result.rows[index].dataValues.erCorrectly, 
              filename:"",
              description:"",
              status:"",
              children:[]
            })
            if(result.rows[index].child.length !== 0){
              for (let index2 = 0; index2 < result.rows[index].child.length; index2++) {
                if(result.rows[index].child[index2].erId === result.rows[index].dataValues.erId){
                  
                  data[index].children.push({ "key": index + '-0-' + index2, "fecha": "", "totalFiles": "","failedFiles": "", "correctFiles": "", "filename":result.rows[index].child[index2].edFileName, "description": result.rows[index].child[index2].edDescription, "status": result.rows[index].child[index2].edStatus })
                }
              }
              
            }
          }
        }

        setDataSource(data)
    }
    const onSizeChange = (currPage, currSize) => {
      setPage(currPage)
      setSize(currSize)
      setReload(reload+1)
    }
    const onPageChange = (currPage, currSize) => {
      setPage(currPage)
      setSize(currSize)
      setReload(reload+1)
    }
    useEffect(() => {
        setDataSource(null)
        fillData()
    }, [reload]);
  let content = (
    <div >

        <Row>
          <Col span={24}>
            <Title level={4}>Archivos Cargados</Title>           
          </Col>
          
        </Row>
        <Row>
          <Col span={24}>
            <Divider style={{ color: props.divider, backgroundColor: props.divider, height: 5, marginTop: 6, marginBottom: 1 }} />
          </Col>

        </Row>
        <Row style={{paddingBottom: '150px'}}>
          <Col xs={24} md={24} lg={24} xl={24}>
          {dataSource == null ? 
            <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/> 
            : 
            <List 
              dataSource={dataSource} 
              onPageChange={onPageChange} 
              onSizeChange={onSizeChange}
              total={total}
              page={page}
              size={size}
              />}

          </Col>
        </Row>
    </div>
  );
  return content;
}

export default View;
