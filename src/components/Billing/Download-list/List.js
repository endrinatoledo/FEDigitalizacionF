import React, {useState} from 'react';
import { Table, Button, Space, Input, ConfigProvider, Tooltip } from 'antd';
import { SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import esp from 'antd/es/locale/es_ES';
import Highlighter from 'react-highlight-words';






const TableList = ({ dataSource}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const pdf = (value) => {
    return (
      <Tooltip title="Pdf">
          <Button shape="round" href={process.env.REACT_APP_API_BASE_URL + "/api/v1/public"+value.fileRoute.split("./tmp/pdf")[1]} target="_blank" icon={<FilePdfOutlined />} size='small' />
                       
      </Tooltip>
    )
  }
  const date = (value) => {
    return (
      <>
        {new Date(value.invReleaseDate).toLocaleString('es').split(" ")[0].split("/").join("-")}
        </>
      )
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
        title: 'Archivo',
        render: pdf,
        align: 'center'
    }
  ];
  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} columns={columns} pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '20', '50']}} scroll={{ x: 800 }} style={{ paddingTop:'1%', width: '100%' }}/>
      
      </ConfigProvider>
    )
}

export default TableList;
