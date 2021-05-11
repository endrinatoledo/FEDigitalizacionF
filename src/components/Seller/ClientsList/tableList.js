import React, {useState, useEffect} from 'react';
import { Tag, Table, Button, Space, Input, ConfigProvider, message, Form } from 'antd';
import { CloudSyncOutlined, SearchOutlined } from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';

// Constants
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;






const TableList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const fillTable = async () => {
    let result = (await axios.get("/api/v1/partnersBySeller/" + localStorage.getItem("sellerCode")) ).data;
    result = ( result == "Not Data" ? [] : result.map((el, i) => {
        return {
          ...el, key: i
        }
      }))
    setDataSource(result)
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
      title: 'Nombre',
      dataIndex: 'prtName',
      key: 'prtName',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        if (a.prtName < b.prtName)
          return -1;
        if ( a.prtName > b.prtName)
          return 1;
        return 0;
      },
      ...getColumnSearchProps('prtName','Nombre'),
    },
    {
      title: 'Correo',
      render: (value) => {
          return ((value.prtEmail == null || value.prtEmail == 'null') ? (<Tag color="red"  >Correo no registrado</Tag>) : (< div style={{ color: "green" }} >{value.prtEmail}</div>) )
      },
      align: 'left'
    }
  ];
  useEffect(() => {
    fillTable()
  }, []);
  
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} columns={columns} pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '20', '50']}} scroll={{ x: 800 }} style={{ paddingTop:'1%', width: '100%' }}/>
      
      </ConfigProvider>
    )
}

export default TableList;
