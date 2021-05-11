import React, { useState } from 'react';
import { Form, Button, Modal, Select, InputNumber  } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// Constants
// Axios Defaults
const axios = require('axios').default;
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};
const validateMessages = {
  required: '¡${label} es requerido!',
  types: {
        email: '¡${label} no es un correo valido!'
    }
};
function success() {
    Modal.success({
      content: '¡Facturas enviadas con exito! ',
    });
  }
const PDFuploadForm = ({config}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initValue, setInitValue] = useState(0);
    const onConfirm = async (min, max) => {
      await axios.post('/api/v1/sortInvoices', {cliId: localStorage.getItem('client'), min, max})
      setLoading(false)
      success()
    }
    const onFinish = async (values) => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
      content: (<><br/>¿Utilizar las facturas desde {values.Facturas.min} hasta {values.Facturas.max}?<br/>Los clientes sin correos asociados no recibiran las facturas.</>),
        onOk() {
          setLoading(true);
          onConfirm(values.Facturas.min, values.Facturas.max)
        },
        onCancel() {
          handleCancel();
        },
      });
    };
    const onChangeInitVal = (val) => {
      setInitValue(val)
    }
    const handleCancel = e => {
      Modal.destroyAll()
    };
  return (
    <div>
      <Form 
        {...layout}
        form={form}
        size="large" 
        layout="horizontal" 
        name="nest-messages" 
        onFinish={onFinish} 
        validateMessages={validateMessages} 
        style={{ marginTop: 20 }}
        initialValues={{
          Facturas: {min: 0, max: 1,cfgCtrlPrefix: config.cfgCtrlPrefix, cfgInvPrefix: config.cfgInvPrefix, cfgPrinterEmail: config.cfgPrinterEmail}
        }}
        >
      <Form.Item
        name={['Facturas', 'client']}
        label="Casa"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Select placeholder="Casa" style={{ width:"200px" }} defaultValue={localStorage.getItem("client")} disabled="true">
            <Select.Option value="1">Beval</Select.Option>
            <Select.Option value="2">Febeca</Select.Option>
            <Select.Option value="3">Sillaca</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item 
          name={['Facturas', 'cfgInvPrefix']}
          label="Prefijo del número de factura"
          rules={[
            {
              required: true
            },
            ]}>
            <Select style={{ width:"200px" }} placeholder="Prefijo del número de factura"  disabled="true">
              {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map( el => {
                return (
                  <Select.Option value={String(el+"-")}>{String(el+"-")}</Select.Option>
                )
              })}
              </Select>
            </Form.Item>
      <Form.Item 
          name={['Facturas', 'cfgCtrlPrefix']}
          label="Prefijo del número de control"
          rules={[
            {
              required: true
            },
            ]}>
            <Select style={{ width:"200px" }} placeholder="Prefijo del número de control"  disabled="true">
              {[...Array(100).keys()].map( el => {
                return (
                  <Select.Option value={String((el.length === 1 ? "0"+el : el)+"-")}>{String((el.length === 1 ? "0"+el : el)+"-")}</Select.Option>
                )
              })}
              </Select>
            </Form.Item>
        <Form.Item 
          name={['Facturas', 'min']}
          label="Número de factura inicial"
          rules={[
            {
              required: true
            },
            ]}>
            <InputNumber
              onChange={onChangeInitVal}
              style={{ width:"200px" }}
              min={0}
              />
            </Form.Item>
      <Form.Item 
        name={['Facturas', 'max']}
        label="Número de factura final"
        rules={[
          {
            required: true
          },
        ]}>
        <InputNumber
          style={{ width:"200px" }}
          min={initValue+1}
          max={initValue+100}
          />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Enviar
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default PDFuploadForm;