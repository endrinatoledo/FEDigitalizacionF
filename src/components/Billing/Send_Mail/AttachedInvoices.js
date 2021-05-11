
import React, { Fragment, useState} from 'react';
import { Table, Space } from 'antd';
import { CloseCircleOutlined, FilePdfOutlined } from '@ant-design/icons';

// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const { Column } = Table;

function AttachedInvoices(props) {
    

    const deleteItem = (invNumber) =>{            
        const arrayFiltered = props.dataSourceSelected.filter(item => item.invNumber !== invNumber )
        props.setDataSourceSelected(arrayFiltered)
      }
  
    return (
    <Fragment>
            <Table pagination={{ pageSize: 3 }}   
                style={{ width: '95%'}}
                dataSource={props.dataSourceSelected}>
                    <Column align='center' title="N° Factura" dataIndex="invNumber" key="invNumber" />                        
                <Column align='center'
                title="Acción"
                key="accion"
                render={(text, record) => (
                    
                    <Space size="middle">
                        <a><CloseCircleOutlined onClick={() =>deleteItem(record.invNumber)}/></a>                    
                    </Space>
                )}
                />
            </Table>
    </Fragment>
    );
}

export default AttachedInvoices;