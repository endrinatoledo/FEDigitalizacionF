import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import 'antd/dist/antd.css';
// Components
import BILLING_RECREATE from '../Billing/recreate/View';
import BILLING_LIST from '../Billing/List/List';
import USERS_CREATE from '../Users/Form/Create';
import USERS_LIST from '../Users/List/List';
import BILLING_SENDMAIL_BY_BATH from '../Billing/Send_Mail_By_Batch/List';
import CLIENT_LIST from '../Clients/List/List';
import SELLER_BILLING_LIST from '../Seller/BillingList/List';
import SELLER_CLIENT_LIST from '../Seller/ClientsList/List';
import CONFIG_VIEW from '../Config/View';
import DOWNLOAD_LIST from '../Billing/Download-list/View'
import INVOICE_LOG from '../Billing/Invoice_Log/View'
// Icons
import {
  LogoutOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
const logoSillaca = require('../../assets/img/Sillaca.jpg')
const logoFebeca = require('../../assets/img/Febeca.png')
const logoBeval = require('../../assets/img/Beval.png')
require('../../assets/css/'+( localStorage.getItem("clientName") != null ? localStorage.getItem("clientName").toLocaleLowerCase() : 'sillaca' )+'.css');
let styles = {
  logo: '../../assets/img/Sillaca.jpg',
  divider: '#e3006e'
}
switch (( localStorage.getItem("clientName") != null ? localStorage.getItem("clientName").toLocaleLowerCase() : 'sillaca') ) {
  case 'beval':
    styles = {
      logo: logoBeval,
      divider: '#d4db58'
    }
    break;
  case 'febeca':
    styles = {
      logo: logoFebeca,
      divider: '#01a2d8'
    }
    break;
  case 'sillaca':
    styles = {
      logo: logoSillaca,
      divider: '#e3006e'
    }
    break;
}
//localStorage.getItem("clientName").toUpperCase()
const { Title } = Typography;
const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
const SiderMenu = () => {

  const [selected, setSelected] = useState(parseInt(localStorage.getItem('nav') === null ? (String(localStorage.getItem("rol")) !== "1" ? (String(localStorage.getItem("rol")) !== "4" ? 0 : 7) : 3) : localStorage.getItem('nav')))
  const getComponent = (select) =>{
    switch (String(select)) {
      case '0':
        return <BILLING_RECREATE divider={styles.divider}/>
      case '1':
        return <BILLING_LIST divider={styles.divider} handler={setSelected} />;
      case '2':
        return <USERS_CREATE divider={styles.divider} />;
      case '3':
        return <USERS_LIST divider={styles.divider} />;
      case '5':
        return <BILLING_SENDMAIL_BY_BATH divider={styles.divider} />;
      case '6':
        return <CLIENT_LIST divider={styles.divider} />;
      case '7':
        return <SELLER_BILLING_LIST divider={styles.divider} />
      case '8':
        return <SELLER_CLIENT_LIST divider={styles.divider} />
      case '9':
        return <CONFIG_VIEW divider={styles.divider} />
      case '10':
        return <DOWNLOAD_LIST divider={styles.divider} />
      case '11':
        return <INVOICE_LOG divider={styles.divider}/>
      default:
        return <BILLING_LIST handler={setSelected} divider={styles.divider} />;
      }
    }
  const selectNav = (value) => {
    localStorage.setItem('nav', value)
    setSelected(value)
    }
  const logout = () => {
    window.location.href="/"
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("client");
    localStorage.removeItem("clientName");
    localStorage.removeItem("rol");
    localStorage.removeItem('nav')
    localStorage.removeItem('sellerCode')
    }
    /*
    En sub1, vista por eliminar

              <Menu.Item key="5" onClick={() => selectNav(5)} className="customclass">
                Envío de Correo por Lotes
                </Menu.Item>
    */
  return (
    <Layout>
      <Sider
        breakpoint="lg" collapsedWidth="0"
        onBreakpoint={broken => {}}
        onCollapse={(collapsed, type) => {}}
        >
        <a href="/">
          <img src={styles.logo} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px", maxWidth: '175px'}} alt="logo" />
          </a>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[String(localStorage.getItem('nav') === null ? (String(localStorage.getItem("rol")) !== "1" ? (String(localStorage.getItem("rol")) !== "4" ? 0 : 7) : 3) : localStorage.getItem('nav'))]} defaultOpenKeys={["sub1","sub2","sub3","sub4"]} >
        {String(localStorage.getItem("rol")) === "0" || String(localStorage.getItem("rol")) === "1" || String(localStorage.getItem("rol")) === "2"  ? (
          <SubMenu key="sub11" icon={<FileTextOutlined/>} title="Bitácora">
            <Menu.Item key="11" onClick={() => selectNav(11)} className="customclass">
              Archivos Cargados
            </Menu.Item>              
          </SubMenu>
        ) : null}
          {String(localStorage.getItem("rol")) !== "1" && String(localStorage.getItem("rol")) !== "4" ? (
            <SubMenu key="sub1" icon={<FileTextOutlined/>} title="Facturación">
              <Menu.Item key="0" onClick={() => selectNav(0)} className="customclass">
                Enviar Lote
                </Menu.Item>
              <Menu.Item key="1" onClick={() => selectNav(1)} className="customclass">
                Listado de Facturas
                </Menu.Item>
              <Menu.Item key="10" onClick={() => selectNav(10)} className="customclass">
                Facturas descargadas
                </Menu.Item>
              </SubMenu>
              ) : null}
          {String(localStorage.getItem("rol")) === "0" || String(localStorage.getItem("rol")) === "3" ? (
            <SubMenu key="sub3" icon={<UserOutlined/>} title="Clientes">
              <Menu.Item key="6" onClick={() => selectNav(6)} className="customclass">
                Listado de clientes
                </Menu.Item>
                </SubMenu>
            ) : null}
          {String(localStorage.getItem("rol")) === "0" || String(localStorage.getItem("rol")) === "1" ? (
            <SubMenu key="sub2" icon={<UserOutlined/>} title="Usuarios">
              <Menu.Item key="2" onClick={() => selectNav(2)} className="customclass">
                Crear
                </Menu.Item>
              <Menu.Item key="3" onClick={() => selectNav(3)} className="customclass">
                Lista de Usuarios
                </Menu.Item>
              </SubMenu>
            ) : null}
          {String(localStorage.getItem("rol")) === "4" || String(localStorage.getItem("rol")) === "0" ? (
            <SubMenu key="sub4" icon={<FileTextOutlined/>} title="Facturación">
              <Menu.Item key="7" onClick={() => selectNav(7)} className="customclass">
                Listado de Facturas
                </Menu.Item>
              <Menu.Item key="8" onClick={() => selectNav(8)} className="customclass">
                Listado de clientes
                </Menu.Item>
              </SubMenu>
              ) : null}
          {String(localStorage.getItem("rol")) === "0" ? (
            <Menu.Item icon={<SettingOutlined />} key="9" onClick={() => selectNav(9)} className="customclass">
            Configuración
            </Menu.Item>
            ) : null}
          <Menu.Item key="exit" icon={<LogoutOutlined />} className="customclass" onClick={logout}>
            Salir
            </Menu.Item>
          </Menu>
        </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <Title level={4} style={{paddingTop: "10px", paddingLeft:"20px", paddingBottom:"20px"}}> Sistema de Digitalización de Facturas</Title>
          </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '85%',
            flex: 'none',
          }}>
          {getComponent(selected)}
          </Content>
        <Footer style={{  display:'table' }}>
          <div style={{display: 'table-cell', verticalAlign:'middle', fontWeight:'bold'}}> Intelix Synergy © 2020 </div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
//textAlign: 'center',
export default SiderMenu
