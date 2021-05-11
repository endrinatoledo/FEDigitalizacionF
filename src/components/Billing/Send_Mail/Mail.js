import React, {Fragment, useState} from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Row, Col } from 'antd';

//import Parse from 'html-react-parser'


function Mail(props) {
  
    const [text, setText] = useState('')

    return (
      <Fragment>
        <div className="textE">
          <Row className="editor">
            <Col span={24}>
              <CKEditor               
                  editor={ClassicEditor}                  
                  data={text}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    props.setBodyMail(data);
                  }}
                />
            </Col>            
          </Row>
        </div>
        
      </Fragment>
    );
  }
  export default Mail;