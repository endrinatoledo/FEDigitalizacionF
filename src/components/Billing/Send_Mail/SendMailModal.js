import React,{ useState} from 'react';
import { Modal, Button, Row, Col, Typography, Input } from 'antd';
import Addressee from './Addressee'
import RecipientList from './RecipientLis'
import Attached_Invoices from './AttachedInvoices'


const SendMailModal = (props) => {

    const [loading, setLoading] = React.useState(false);
    //const [AddresseMail, setAddresseMail] = useState([])
    const [arrayAttachedInvoices, setArrayAttachedInvoices] = useState(props.SelectedInvoices)    
    const { Title } = Typography;

    const ColorLine = ({ color }) => ( 
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 5,
                marginRight:'5%'
                
            }}
        />
    );
    
    const deleteItem = (id) =>{    
        const arrayFiltered = props.AddresseMail.filter(item => item.id !== id )
        props.setAddresseMail(arrayFiltered)
      }


    const onOk = () => {
      /*form
        .validateFields()
        .then(async values => {
              await axios.put('/api/v1/partners/'+ toEdit.prtId, { prtName: toEdit.prtName, prtEmail: values.Email, prtKey: toEdit.prtKey})
              fillTable()
              setToEdit({prtEmail: '', prtId: 0, prtName: ''})
              setVisible(false)
              form.resetFields();
          
        });*/
    }


    let content = (

        
        <Modal width='40%'
          visible={props.openSendMailModal} 
          title="Enviar facturas por Email" 
          onOk={props.Send} 
          onCancel={props.handleCancel}
          style={{textAlign: 'center'}} 
          onOk={onOk} footer={[
            <Button key="back" onClick={props.handleCancel}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" loading={props.loading} onClick={props.Send}>
              Enviar
            </Button>,
          ]}
          >
              <Row>
                <Col span={12}>
                    <Title level={5} style={{textAlign: 'center'}}>Destinatario</Title>
                    <ColorLine color="#33C1BD" />
                    <Row>
                        <Col span={24} style={{ paddingLeft:'2%', paddingRight:'5%' }}>
                            <Addressee 
                            AddresseMail={props.AddresseMail}
                            setAddresseMail={props.setAddresseMail} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ paddingLeft:'2%', paddingRight:'5%' }}>
                            <RecipientList  
                            AddresseMail={props.AddresseMail}
                            setAddresseMail={props.setAddresseMail}                                            
                            deleteItem={deleteItem}
                            />
                        </Col>
                    </Row>
                    
                </Col>
                <Col span={12}>
                    <Title level={5} style={{textAlign: 'center'}}>Listado de Facturas</Title>
                    <ColorLine color="#33C1BD" />
                    <Row>
                      <Col span={24}>
                      <Attached_Invoices 
                        dataSourceSelected={props.dataSourceSelected}
                        setDataSourceSelected={props.setDataSourceSelected} />                  
                      </Col>
                    </Row>
                </Col>
              </Row>
              <Row>
              <Col span={24}>
                <Input.TextArea showCount maxLength={50} placeholder="Asunto..." value={props.emailSubject} onChange={(e) => props.setEmailSubject(e.target.value)}/>
                </Col>
              </Row>
              <Row style={{marginTop: "20px"}}>
              <Col span={24}>
                <Input.TextArea showCount maxLength={200} placeholder="Contenido del correo..." value={props.emailText} onChange={(e) => props.setEmailText(e.target.value)}/>
                </Col>
              </Row>
        </Modal>
    )
    return content;
}

export default SendMailModal;