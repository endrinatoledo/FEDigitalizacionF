import React from 'react';
import { Modal, Button, Row, Col } from 'antd';
import moment from 'moment';

const ReprintModal = (props) => {
    let content = (
        <Modal
          title="Reeimprimir Facturas"
          visible={props.open}
          onOk={props.handleOk}
          onCancel={props.handleCancel}
          style={{textAlign: 'center'}}
          footer={[
            <Button key="back" onClick={props.handleCancel}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" loading={props.loading} onClick={props.handleOk}>
              Enviar
            </Button>,
          ]}
        >
        <Row gutter={[16, 16]}>
            <Col span={12} style={{fontWeight: 'bold'}}>Nro Factura</Col>
            <Col span={12} style={{fontWeight: 'bold'}}>Fecha Impresión</Col>
        </Row>

        {props.dataSourceSelected.map((data) => (
            <Row key={data.invId} value={data.invId}>

            <Col  span={12}>{data.invNumber}</Col>
            <Col  span={12}>{data.invReleaseDate}</Col>
       
            </Row>
            ))}

        </Modal>
    )
    return content;
}

export default ReprintModal;