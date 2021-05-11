import React, {useState, useEffect} from 'react';
import { Table, Button, Space, Tooltip, Tag, Input, ConfigProvider, Modal } from 'antd';
import { FilePdfOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';

// Constants
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;






const TableList = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [SendDisabled, setSendDisabled] = useState(true);
  const [searchedColumn, setSearchedColumn] = useState('');
  const [batchParent, setBatchParent] = useState(0);
  const ClickSend = (e) => {
    const asNullEmails = (dataSource.filter(el => el.partners.prtEmail === "null")).length != 0
    setLoading(true)
    Modal.confirm({
      icon: (<ExclamationCircleOutlined />),
      title: "Advertencia",
      content: (asNullEmails ? (
        <p>
          <h6>¿Enviar las facturas a los respectivos correos registrados?</h6><br></br>
          Algunos correos no estan registrados
          y sus respectivas facturas no seran enviadas.
        </p>) : (
          <p>
            <h6>¿Enviar las facturas a los respectivos correos registrados?</h6>
          </p>))
        ,
      onOk: handleOk,
      onCancel: handleCancel,
      okText: "Si",
      cancelText: "Cancelar"
    });
  }
  const pdf = (value) => {
    return (
        <Tooltip title="Pdf">
            <Button shape="round" href={process.env.REACT_APP_API_BASE_URL + "/api/v1/public"+value.fileRoute.split("./tmp/pdf/pages")[1]} target="_blank" icon={<FilePdfOutlined />} size='small' />
                         
        </Tooltip>
    )
  }
  const dest = (value) => {
    return (
        <>
        {value.partners.prtEmail}
        </>
    )
  }
  const sendBool = (value) => {
    return (
        <>
        {value.partners.prtEmail === "null" ? 
          (<Tag color="red" key={"No registrado"}>
            {"No se puede enviar"}
            </Tag>)
          : 
          (<Tag color="green" key={value.partners.prtEmail}>
            {"Se puede enviar"}
            </Tag>)}
        </>
    )
  }
  const handleOk = async e => {
    for(let i = 0; i < dataSource.length; i++){
      if(dataSource[i].partners.prtEmail != "null" ){
        await axios.post('/api/v1/sendEmail', {
          email: "eleon@intelix.biz",//Cambiar
          subject: "Factura N°: " +dataSource[i].invNumber,
          text: "Factura N°: " +dataSource[i].invNumber,
          filename: "Factura N°: " +dataSource[i].invNumber+".pdf",
          content: dataSource[i].fileRoute
        })
        await axios.put('/api/v1/invoices/' + dataSource[i].invId,{
          ...dataSource[i],
          invSended: 'true'
        })
        await axios.put('/api/v1/batchs/' + batchParent,{
          bthSended: 'true'
        })
      }
    }
    setLoading(false)
    Modal.destroyAll()
    Modal.success({
      content: '¡Correos enviados con exito!',
    });
    setDataSource([])
    props.fillParent()
  };

  const handleCancel = e => {
    setLoading(false)
    Modal.destroyAll()
  };
  const fillTable = async () => {
    setSendDisabled(true)
    if(props.selectedBatch != ''){
      setBatchParent(props.selectedBatch)
      setSendDisabled(false)
      const result = (await axios.get("/api/v1/invoices/invoicesByBatch/"+props.selectedBatch) ).data
      setDataSource((result === "Not Data" ? [] :result.filter( fil => String(fil.clients.cliId) === localStorage.getItem("client") && fil.readError !== "true").map((el, i) => {
        return {
          ...el, key: i
        }
      })))
    }
  }
  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            TableList.searchInput = node;
          }}
          placeholder={`Buscar ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => TableList.searchInput.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };
  const columns = [
    {
      title: 'Factura Nro',
      dataIndex: 'invNumber',
      key: 'invNumber',
      sorter: (a, b) => {
        if (a.invNumber < b.invNumber)
          return -1;
        if ( a.invNumber > b.invNumber)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('invNumber','Factura Nro'),
    },
    {
      title: 'Zona',
      dataIndex: 'invZone',
      key: 'invZone',
      sorter: (a, b) => a.invZone - b.invZone,
      ...getColumnSearchProps('invZone','Zona'),
    },
    {
        title: 'Viaje',
        dataIndex: 'invTrip',
        key: 'invTrip',

        sorter: (a, b) => a.invTrip - b.invTrip,
        ...getColumnSearchProps('invTrip',"Viaje"),
    },
    {
        title: 'Destino',
        render: dest,
        align: 'center'
    },
    {
        title: 'Envio',
        render: sendBool,
        align: 'center'
    },
    {
        title: 'Archivo',
        render: pdf,
        align: 'center'
    }
  ];
  useEffect(() => {
    fillTable()
  }, [props.selectedBatch]);
  
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} columns={columns} pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '20', '50']}} scroll={{ x: 800 }} style={{ paddingTop:'1%', width: '100%' }}/>
        < div style={{paddingTop: 15}}>
        <Button type="primary" onClick={ClickSend} disabled={SendDisabled} loading={loading} style={{float: 'right'}}>
          Enviar
        </Button>
        </div>
    </ConfigProvider>
    )
}

export default TableList;