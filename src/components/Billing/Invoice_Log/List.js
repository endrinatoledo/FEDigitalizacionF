import React from 'react';
import { Table,  ConfigProvider, Tag, Pagination } from 'antd';
import esp from 'antd/es/locale/es_ES';

const TableList = ({ dataSource, page, size, total, onSizeChange, onPageChange}) => {

  
  const date = (value) => {
    

    if(value !== '' || value !== null){
      let date1 = new Date(value);
    let year = date1.getFullYear();
    let month = date1.getMonth() + 1;
    let dt = date1.getDate();

    if (dt < 10) {  dt = "0" + dt; }
    if (month < 10) { month = "0" + month; }
    let fechaF = dt + "-" + month + "-" +  year + " " + new Date(value).toLocaleTimeString()

    return <>{fechaF}</>;
    }else{
      return <>{' '}</>;
    }
    
  };

  const statusRender = (value) => {
    if(String(value.status) === "CORRECTO" ){
        return( <Tag color="green">Correcto</Tag>)
      }else
      if(String(value.status) === "ERROR" ){
        return( <Tag color="red">Error</Tag>)
      }
    }

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (data) => {
        if (data != '')
            return date(data);
        if (data == '')
            return ' ';
      },
      align: 'center',
      defaultSortOrder: 'descend'
      
    },
    {
      title: 'Total Archivos',
      dataIndex: 'totalFiles',
      key: 'totalFiles',
      align: 'center'
    },
    {
        title: 'Archivos Correctos',
        dataIndex: 'correctFiles',
        key: 'correctFiles',
        align: 'center',
        
      },
    {
      title: 'Archivos con Error',
      dataIndex: 'failedFiles',
      key: 'failedFiles',
      align: 'center',
      
    },    
    {
      title: 'Nombre de Archivo',
      dataIndex: 'filename',
      key: 'filename',
      align: 'center',
    },
    {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description',
        align: 'center',
      },
    {
        title: 'Estatus',
        render: statusRender,
        align: 'center',
        
    }
  ];
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} columns={columns} pagination={false}/>
      <Pagination
              style={{ paddingTop:'1%', float: 'right'}}
              total={total}
              onShowSizeChange={onSizeChange}
              defaultPageSize={size}
              onChange={onPageChange}
              defaultCurrent={page}
              />
      </ConfigProvider>
    )
}

export default TableList;
