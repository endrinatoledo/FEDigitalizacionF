import React, { useState } from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';

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
const UserForm = () => {
  const [isSeller, setIsSeller] = useState(false)
  const [form] = Form.useForm();
    const success = () => {
      form.resetFields()
        Modal.success({
          content: 'Usuario registrado con exito',
        });
      }
    const onFinish = async (values) => {
        const user = {...values, usrStatus: 0 }
        const result = await axios.post('/api/v1/users',{...user})
        if(result.status === 200)
            success()
    };

  return (
    <Form {...layout} size="large" layout="horizontal" name="nest-messages" onFinish={onFinish} form={form} validateMessages={validateMessages} style={{ marginTop: 20 }}>
      <Form.Item
        name='usrName'
        label="Nombres"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Nombres..." />
      </Form.Item>
      <Form.Item
        name='usrLastName'
        label="Apellidos"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Apellidos..." />
      </Form.Item>
      <Form.Item
        name='usrEmail'
        label="Correo"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
      >
        <Input placeholder="Correo..." />
      </Form.Item>
      <Form.Item
        name='usrRol'
        label="Rol:"
        rules={[
          {
            required: true
          },
        ]}
      >
        <Select placeholder="Rol" onChange={(e)=>{ ( e === "4" ? setIsSeller(true) : setIsSeller(false) ) }}>
            <Select.Option value="1">Gerente de Logística</Select.Option>
            <Select.Option value="2">Archivo y valija</Select.Option>
            <Select.Option value="3">Departamento de ventas</Select.Option>
            <Select.Option value="4">Vendedor</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name='cliId'
        label="Cliente"
        rules={[
          {
            required: true
          },
        ]}
      >
        <Select placeholder="Cliente">
            <Select.Option value="1">Beval</Select.Option>
            <Select.Option value="2">Febeca</Select.Option>
            <Select.Option value="3">Sillaca</Select.Option>
        </Select>
      </Form.Item>
      { isSeller ?
        (<Form.Item
          name='usrSellerCode'
          label="Código de vendedor"
          rules={[
            {
              required: true
            },
          ]}
        >
          <Input placeholder="Código de vendedor..." />
          </Form.Item>)
        : null
      }
      
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
      <Button htmlType="button" onClick={()=>form.resetFields()} style={{ marginRight: "40px" }}>
          Reiniciar
        </Button>
        <Button type="primary" htmlType="submit">
          Registrar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;