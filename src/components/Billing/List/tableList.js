import React, {useState, useEffect} from 'react';
import { Table, Button, Space, Tooltip, Input, ConfigProvider, Tag, Pagination } from 'antd';
import { FilePdfOutlined, SearchOutlined } from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';

// Constants
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;





const TableList = ({ dataSourceSelected, setDataSourceSelected, selectedBatch, reload, setReload }) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sorterKey, setSorterKey] = useState('');
  const [sorterOrder, setSorterOrder] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true)
  const onSelectChange = (selectedRowKeys) => {
    setDataSourceSelected(dataSource.filter( (el, i) => selectedRowKeys.includes(i) ))
    setSelectedRowKeys(selectedRowKeys)
  };
  const pdf = (value) => {
    return (
      <Tooltip title="Pdf">
          <Button shape="round" href={process.env.REACT_APP_API_BASE_URL + "/api/v1/public"+value.fileRoute.split("./tmp/pdf")[1]} target="_blank" icon={<FilePdfOutlined />} size='small' />
                       
      </Tooltip>
    )
  }
  const sendedRender = (value) => {
    if(String(value.invSended) === "true" || String(value.invSended) === '1'){
        return( <Tag color="green">Enviado</Tag>)
      }else{
        return( <Tag color="red">Sin enviar</Tag>)
      }
    }
  const date = (value) => {
    return (
      <>
        {new Date(value.invReleaseDate).toLocaleString('es').split(" ")[0].split("/").join("-")}
        </>
      )
    }
  const fillTable = async () => {
    if(selectedBatch == "all"){
      const result = (await axios.get(`/api/v1/invoices/invoicesByClient/3?read=false&page=${page-1}&limit=${size}&searchedColumn=${searchedColumn}&searchText=${searchText}&sorterOrder=${sorterOrder}&sorterKey=${sorterKey}`) ).data
      setTotal(result.count)
      setDataSource((result.rows.length == 0 ? [] :result.rows.filter( fil => fil.clients.cliId == localStorage.getItem("client")).map((el, i) => {
        return {
          ...el, key: i
        }
      })))
      setLoading(false)
    }else{
      const result = (await axios.get("/api/v1/invoices/invoicesByBatch/" + selectedBatch) ).data
      setDataSource((result == "Not Data" ? [] : result.map((el, i) => {
        return {
          ...el, key: i
        }
      })))
      setLoading(false)
    }
    
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
    setPage(1)
    setReload(reload+1)
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
    selections: [
        
        {
          key: 'odd',
          text: 'Seleccionar filas impares',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            setSelectedRowKeys(newSelectedRowKeys)
          },
        },
        {
          key: 'even',
          text: 'Seleccionar filas pares',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            setSelectedRowKeys(newSelectedRowKeys)
          },
        },
      ],
      
  }
  const handleTableChange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter;
    setSorterKey(columnKey)
    setSorterOrder(order)
    setPage(1)
    setReload(reload+1)
  }
  const columns = [
    {
      title: 'Factura Nro',
      dataIndex: 'invNumber',
      key: 'invNumber',
      align: 'center',
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
      title: 'Fecha de emisión',
      key: 'invReleaseDate',
      align: 'center',
      render: date,
      sorter: (a, b) => {
        if (a.invReleaseDate < b.invReleaseDate)
          return -1;
        if ( a.invReleaseDate > b.invReleaseDate)
          return 1;
        return 0;
      },
    },
    {
      title: 'Zona',
      dataIndex: 'invZone',
      key: 'invZone',
      align: 'center',
      sorter: (a, b) => {
        if (a.invZone < b.invZone)
          return -1;
        if ( a.invZone > b.invZone)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('invZone','Zona'),
    },
    {
      title: 'Vendedor',
      dataIndex: 'invSeller',
      key: 'invSeller',
      align: 'center',
      sorter: (a, b) => {
        if (a.invSeller < b.invSeller)
          return -1;
        if ( a.invSeller > b.invSeller)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('invSeller','Vendedor'),
    },
    {
      title: 'Cliente',
      align: 'center',
      render: (data) => {
        return(<>{data.partners.prtName } - ({data.partners.prtKey})</>)
      }
    },
    {
        title: 'Viaje',
        dataIndex: 'invTrip',
        key: 'invTrip',
        align: 'center',
        sorter: (a, b) => {
          if (a.invTrip < b.invTrip)
            return -1;
          if ( a.invTrip > b.invTrip)
            return 1;
          return 0;
        },
        ...getColumnSearchProps('invTrip','Viaje'),
    },
    {
      title: 'Estado',
      render: sendedRender,
      align: 'center'
    },
    {
        title: 'Archivo',
        render: pdf,
        align: 'center'
    }
  ];
  useEffect(() => {
    setLoading(true)
    setDataSource([])
    fillTable()
  }, [selectedBatch]);
  useEffect(() => {
    setLoading(true)
    setDataSource([])
    fillTable()
  }, [reload]);
  return (
    <div style={{paddingBottom: '150px'}}>
      <ConfigProvider locale={esp}>
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          rowSelection={rowSelection} 
          loading={loading}
          onChange={handleTableChange}
          pagination={selectedBatch != 'all' ? { defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '20', '50']} : false} 
          scroll={{ x: 800 }} 
          style={{ paddingTop:'1%', width: '100%' }}/>
          {selectedBatch == 'all' ? 
            <Pagination
              style={{ paddingTop:'1%', float: 'right'}}
              total={total}
              onShowSizeChange={onSizeChange}
              defaultPageSize={size}
              onChange={onPageChange}
              defaultCurrent={page}
              current={page}
              />
            : 
            null 
            } 
        </ConfigProvider>
    </div>
    )
}

export default TableList;
