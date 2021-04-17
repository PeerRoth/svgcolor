import React , { useState } from 'react';
import { Button , Row , Col } from 'react-bootstrap';
import ColorPacker from './colorpacker.jsx';

export default function ColorWidget( props ) {

    const { myColor , changeOne } = props;

    const [ local , setLocal ] = useState( myColor );

    function handleChange( event ) {
        let hex = event.target.value;
        setLocal( hex );
    }


    // async function submitColor( input , stat ) {
    //     let clr = stat === 'state' ? color0 : input;
    //     console.log( input )
    //     axios( {
    //         url : 'http://localhost:3001/colors/' + clr ,
    //         method : 'get' ,
    //     } )
    //     .then( res => {
    //         console.log( res );
    //     } )
    // }


    return (
        <Col>
            <Row>
                <Col>

                    <Row>
                        <Col>
                            { local }
                        </Col>
                    </Row>


                    <Row>
                        <Col>
                            <Button 
                                // onClick={ ( ) => { submitColor( color0 ) } }
                                >
                                Change Color0
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>


            <Row className='justify-content-md-center'>
                <Col></Col>
                <Col className='justify-content-md-center'>
                    <ColorPacker 
                        setColor0={ setLocal }
                        color0={ local }
                        changeOne={ changeOne }
                        // submitColor={ submitColor }
                    />
                </Col>
                <Col></Col>

            </Row>

            <Row>
                <Col>
                </Col>
            </Row>

        </Col>

    )

}