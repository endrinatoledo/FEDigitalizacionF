import React, {useState, useEffect}  from 'react';
import { Row, Col, Typography, Divider, Tabs, Tooltip, Descriptions, Select, Modal    } from 'antd';
import { MailOutlined, PrinterOutlined } from '@ant-design/icons';
import TableList from './tableList';
import ErrTableList from './ErrTableList';
import ReprintModal from './reprintModal';
import SendMailModal from '../Send_Mail/SendMailModal'
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
const { Title } = Typography;

const List = (props) => {
  const [reprintLoading, setReprintLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [dataSourceSelected, setDataSourceSelected] = React.useState([]);
  const [dataSourceSelected2, setDataSourceSelected2] = React.useState([]);
  const [openSendMailModal, setOpenSendMailModal] = React.useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [reload, setReload] = React.useState(0);
  const [reload2, setReload2] = React.useState(0);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [AddresseMail, setAddresseMail] = useState([])
  const [emailText, setEmailText] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const fillTable = async () => {
    const result = (await axios.get("/api/v1/allBatchsByClient/"+localStorage.getItem("client")) ).data
    setDataSource((result === "Not Data" ? [] : result ))
  }
  useEffect(() => {
    fillTable()
  }, []);
  

  function showModalReprint () {
    if(dataSourceSelected2.length !== 0){
      setOpen(true);
      }
    };
  async function handleReprint (e){
    setReprintLoading(true)
    const InvoicesNum = dataSourceSelected2.map( el => el.invNumber);
    const cliId = localStorage.getItem('client');
    const result = (await axios.post("/api/v1/reprint/", {cliId, InvoicesNum} )).data
    successReprint()

  }
  function successReprint() {
    handleCancel();
    setDataSourceSelected2([])
    setReload2(reload2+1);
    setSelectedBatch(selectedBatch);
    Modal.success({
      content: 'Reimpresion solicitada con éxito',
    });
    setOpen(false);
    setReprintLoading(false)
  }
  function handleCancel (e) {
    setOpen(false);
    setOpenSendMailModal(false);
    setLoadingEmail(false)
    setReprintLoading(false)
    };
    function showModalSendMail() {
      if (dataSourceSelected.length === 0) {
        errordataSourceSelected();
      } else {
        dataSourceSelected.forEach((item) => {
          if (item.invControlNumber === null) {
            deleteInvoicesWithError();            
          }
          return true;
        });
        //aqui
        const arrayFiltered = dataSourceSelected.filter(
          
          (value) => value.readError !== true
        );
        setDataSourceSelected(arrayFiltered);
        if (dataSourceSelected.length === 0) {
          errordataSourceSelected();
        } else {
          setOpenSendMailModal(true);
        }
      }

      function deleteInvoicesWithError() {
        Modal.warning({
          content:
            "Se eliminarán del lote seleccionado las facturas con errores",
        });
      }
    };
    function errorAddressee() {
      Modal.error({
        content: 'Debe Seleccionar el destinatario',
      });
      setLoadingEmail(false)
        setReprintLoading(false)
    }  
    function errordataSourceSelected() {
      Modal.error({
        content: 'Debe seleccionar facturas a enviar',
      });
    }   
    function success() {
      handleCancel();
      setReload(reload+1);
      setSelectedBatch(selectedBatch);
      Modal.success({
        content: 'Correo enviado con éxito',
      });
      setOpenSendMailModal(false);
      setLoadingEmail(false)
    }
    
    function notSuccessful(){
      Modal.error({
        content: 'Error al enviar correo',
      });
      setOpenSendMailModal(false);
      setLoadingEmail(false)
    }
  
    const Send = async() => {
      setLoadingEmail(true)
      if(AddresseMail.length == 0) {  
       errorAddressee()
      }else if(dataSourceSelected.length == 0) {  
        errordataSourceSelected()
      }
      else{
        let band = 0, data, result;
       for(let i = 0; i < AddresseMail.length; i++){
        data = {
          email: AddresseMail[i].email,
          subject: emailSubject,
          text: emailText,
          filename: dataSourceSelected.map(el => "Factura N°: " +el.invNumber+".pdf" ),
          content: dataSourceSelected.map(el => el.fileRoute)
          }
          try {
            result = await axios.post('/api/v1/multiFileEmail', data)
            if( result.status === 200 ){
              for (let j = 0; j < dataSourceSelected.length; j++) {
                await axios.put('/api/v1/invoices/' + dataSourceSelected[j].invId,{
                  ...dataSourceSelected[j],
                  invSended: 'true'
                })
              }
            }else{
              band = 1;
              notSuccessful()
              break;
            }
          } catch (error) {
            band = 1;
            notSuccessful()
            break;
          }
       }
       if(band !== 1 ){
        success()
       }
      } 
   }

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
            <Select placeholder="Lote" defaultValue={"all"} onChange={(val)=>setSelectedBatch(val)} style={{ minWidth: "20vw"}}>
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
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Listado de facturas" key="1">
                <Row justify="start">
                  <Col xs={4.5} md={2} lg={1} xl={1}>
                    <Tooltip title="Enviar">
                      <MailOutlined style={{marginTop: '9%' , fontSize: '26px'}} onClick={showModalSendMail}/>
                      </Tooltip>
                    </Col>
                  </Row>
                <TableList setReload={setReload} reload={reload} dataSourceSelected={dataSourceSelected} setDataSourceSelected={setDataSourceSelected} selectedBatch={selectedBatch}/>
                </Tabs.TabPane>
              <Tabs.TabPane tab="Listado de errores" key="2">
                <Row justify="start">
                  <Col xs={4.5} md={2} lg={1} xl={1}>
                    <Tooltip title="Reeimprimir">
                      <PrinterOutlined style={{marginTop: '9%' , fontSize: '26px'}} onClick={showModalReprint}/>
                      </Tooltip>
                    </Col>
                  </Row>
                  <ErrTableList setReload={setReload2}  reload={reload2} dataSourceSelected={dataSourceSelected2} setDataSourceSelected={setDataSourceSelected2} selectedBatch={selectedBatch}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>

        </Row>
        
        <ReprintModal loading={reprintLoading}  open={open} handleOk={handleReprint} handleCancel={handleCancel}
        dataSourceSelected={dataSourceSelected2} setDataSourceSelected={setDataSourceSelected2}/>
      <SendMailModal 
      emailSubject={emailSubject}
      setEmailSubject={setEmailSubject}
      emailText={emailText}
      setEmailText={setEmailText}
      dataSourceSelected={dataSourceSelected} 
      setDataSourceSelected={setDataSourceSelected}
      AddresseMail={AddresseMail}
      setAddresseMail={setAddresseMail} 
      loading={loadingEmail}
      Send={Send}  
      openSendMailModal={openSendMailModal} handleCancel={handleCancel}/>

    </div>
  );
  return content;
}

export default List;
