import React from 'react';
import { Col , Image } from 'react-bootstrap';

export default function ShownyBuns( props ) {

    const { imageGiven } = props;
    const showImage = window.URL.createObjectURL( imageGiven );

    return (

        <Col>
        
            <Image width='300' src={ showImage } alt='image given' />
        
        </Col>

    )
}