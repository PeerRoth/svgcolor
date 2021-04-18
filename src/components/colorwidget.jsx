import React , { useState } from 'react';
import { Button , Row , Col } from 'react-bootstrap';
import ColorPacker from './colorpacker.jsx';

export default function ColorWidget( props ) {

    const { myColor , changeOne , indix } = props;

    const [ local , setLocal ] = useState( myColor );

    function handleChange( event ) {
        let hex = event.target.value;
        setLocal( hex );
    }



    return (
        <Col
            style={ { 
                borderBottom : '1px solid gray' 
            } } >
            <Row>
                <Col>

                    <Row>
                        <Col
                            xs={ 1 }
                            style={ { 
                                fontWeight : 500
                            } } >
                            { indix } 
                        </Col>
                        <Col
                            xs={ 2 }>
                            { local }
                        </Col>
                    </Row>


                    {/* <Row>
                        <Col>
                            <Button 
                                // onClick={ ( ) => { submitColor( color0 ) } }
                                >
                                Change Color
                            </Button>
                        </Col>
                    </Row> */}
                </Col>
            </Row>


            <Row className='justify-content-md-center'>
                <Col></Col>
                <Col className='justify-content-md-center'>
                    <ColorPacker 
                        indix={ indix }
                        setColor0={ setLocal }
                        color0={ local }
                        changeOne={ changeOne }
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