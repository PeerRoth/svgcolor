import React , { useEffect } from 'react';
import { Button , Form , Row , Col } from 'react-bootstrap';
import axios from 'axios';
import ColorPacker from './colorpacker.jsx';
import ColorWidget from './colorwidget.jsx';



export default function SvgPlace( props ) {

    const {
        color0 , setColor0 ,
        colors , setColors ,
        setAllColors ,
        changeOne
        // color1 , setColor1 ,
        // color2 , setColor2 ,
        // color3 , setColor3 ,
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



    function handleChange( event ) {
        let hex = event.target.value;
        setColor0( hex );
    }




    async function submitColor( input , stat ) {
        let clr = stat === 'state' ? color0 : input;
        console.log( input )
        axios( {
            url : 'http://localhost:3001/colors/' + clr ,
            method : 'get' ,
        } )
        .then( res => {
            console.log( res );
        } )
    }


    return (
        <Col>
            { /* <Row>
                <Col>
                    <Row>
                        <Col>
                            { color0 }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button 
                                onClick={ ( ) => { submitColor( color0 ) } }
                                >
                                Change Color0
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row> */}
            {/* <Row>
                <Col>
                    <Form>
                        <Form.Group controlId="formBasicColor">
                            <Form.Label>Hex Color : #</Form.Label>
                            <Form.Control 
                                name='hex'
                                value={ color0 }
                                onChange={ handleChange }
                                type="text" placeholder="efef12" 
                                />
                                <Form.Text className="text-muted">
                                    <br />We'll replace a color in SVG with the one you provide.
                                </Form.Text>
                        </Form.Group>
                    </Form>
                </Col>
            </Row> */}
            {/* <Row className='justify-content-md-center'>
                <Col></Col>
                <Col className='justify-content-md-center'>
                    <ColorPacker 
                        setColor0={ setColor0 }
                        color0={ color0 }
                        submitColor={ submitColor }
                    />
                </Col>
                <Col></Col>
            </Row> */}

            <Row>
                <Col>
                { colors.length > 0 
                ?
                <Row>
                    { colors.map( ( a , b ) => ( <ColorWidget myColor={ a } changeOne={ changeOne } /> ) ) }
                </Row>
                :
                <Row></Row>
                }
                </Col>
            </Row>
        </Col>
    )
}