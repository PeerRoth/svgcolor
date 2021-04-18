import React , { useEffect } from 'react';
import { Row , Col } from 'react-bootstrap';
import axios from 'axios';
// import ColorPacker from './colorpacker.jsx';
import ColorWidget from './colorwidget.jsx';



export default function SvgPlace( props ) {

    const {
        colors , setColors ,
        // setAllColors ,
        changeOne
    } = props;



    useEffect( ( ) => {
        async function getColors( ) {
            axios( {
                url : 'http://localhost:3001/firststep/' ,
                method : 'get'
            } )
            .then( res => {
                console.log( res );
                setColors( res.data );
            } )
        }
        getColors( )
    } , [ ] );

    return (
        <Col className='ScideBer'>
           
            <Row>
                <Col>
                { colors.length > 0 
                ?
                <Row>
                    { colors.map( ( a , b ) => ( <ColorWidget indix={ b } key={ b + 'clrwdgt' } myColor={ a } changeOne={ changeOne } /> ) ) }
                </Row>
                :
                <Row></Row>
                }
                </Col>
            </Row>
        </Col>
    )
}