import React from 'react';
import { Col , Form } from 'react-bootstrap';


export default function PloderBuns( props ) {

    const { handleUpload } = props;

    return (

        <Col>
        
            <Form>
                <Form.Group>
                    <Form.File
                        accept='image/svg'
                        name='file'
                        onChange={ handleUpload }
                        id="exampleFormControlFile1" 
                        label="Upload AI , PDF , or SVG" 
                    />
                </Form.Group>
            </Form>
        
        </Col>
    )
}