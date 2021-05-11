import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Modal, message, Input  } from 'antd';
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
  
const PDFuploadForm = ({ config }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const success = () => {
        setLoading(false)
        Modal.success({
            content: '¡Configuración actualizada con exito!',
          });
      }
    const onFinish = async (values) => {
        setLoading(true)
        const cfgCtrlPrefix = values.Facturas.cfgCtrlPrefix .length == 2 ? '0'+values.Facturas.cfgCtrlPrefix : values.Facturas.cfgCtrlPrefix;
        const res = await axios.put('/api/v1/configByClientId/'+localStorage.getItem('client'), {...values.Facturas, cfgCtrlPrefix })
        success()
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
          Facturas: {cfgCtrlPrefix: config.cfgCtrlPrefix, cfgInvPrefix: config.cfgInvPrefix, cfgPrinterEmail: config.cfgPrinterEmail}
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
            <Select style={{ width:"200px" }} placeholder="Prefijo del número de factura">
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
            <Select style={{ width:"200px" }} placeholder="Prefijo del número de control">
              {[...Array(100).keys()].map( el => {
                return (
                  <Select.Option value={String((el.length === 1 ? "0"+el : el)+"-")}>{String((el.length === 1 ? "0"+el : el)+"-")}</Select.Option>
                )
              })}
              </Select>
            </Form.Item>
    <Form.Item 
        name={['Facturas', 'cfgPrinterEmail']}
        label="Correo de la impresora"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
      >
        <Input placeholder="Correo..." />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Actualizar
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default PDFuploadForm;