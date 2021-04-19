import React from 'react';
import { Col , Form } from 'react-bootstrap';
import PlodingRear from './plodingrear.jsx';

export default function PloderBuns( props ) {

    const { handleUpload } = props;

    return (

        <Col>
        
        <PlodingRear 
            handleUpload={ handleUpload }
            />
{/* 
            <Form>
                <Form.Group>
                    <Form.File
                        accept=".svg"
                        name='file'
                        onChange={ handleUpload }
                        id="exampleFormControlFile1" 
                        label="Select an SVG from your device. " 
                    />
                </Form.Group>
            </Form> */}
        
        </Col>
    )
}