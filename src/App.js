import React , { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
        Container ,
        Row ,
        Col ,
    } from 'react-bootstrap';
import PloderBuns from './components/plodybuns.jsx';
import ShownyBuns from './components/shownybuns.jsx';
import SvgPlace from './components/svgplace.jsx';
import axios from 'axios';


function App( ) {

    const [ color0 , setColor0 ] =      useState( '4b79d4' );
    const [ upload0 , setUpload0 ] =    useState( null );
    const [ paths0 , setPaths0 ] =      useState( [ ] );

    function handleUpload( event ) {
        let files = Object.keys( event.target.files ).map( a => ( event.target.files[ a ] ) );
        console.log( files );
        setUpload0( files[ 0 ] );
        let plode = new FormData( );
        plode.append( 'file' , event.target.files[ 0 ] );
        axios( {
            url : 'http://localhost:3001/upload/' ,
            method : 'post' ,
            data : plode
        } )
        .then( res => {
            console.log( res );
            let pats = res.data.paths;
            setPaths0( pats );
        } )
    }


    function handlePathSelection( pth ) {
        axios( {
            url : 'http://localhost:3001/deletepath/' ,
            method : 'post' ,
            data : pth
        } )
    }

    return (
        <div className="App">
            <header className="App-header">
                <img 
                    src={ logo } 
                    className="App-logo" 
                    alt="logo" 
                />
            </header>

            <Container>


             

                <SvgPlace
                    svg={ logo }
                    color0={ color0 }
                    setColor0={ setColor0 }
                />

                <Row style={ { borderTop : '1px solid red' } }>
                    <Col></Col>
                </Row>
                
 

                { upload0 ?
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                { paths0.length > 0
                                ? 
                                <Row>
                                    <Col>
                                        { paths0.map( path => (
                                        <Row>
                                            <Col
                                                style={ { 
                                                    fontSize : '.8rem' , 
                                                    marginBottom : '.9rem'
                                                } }
                                                >
                                                { path }
                                            </Col>
                                        </Row>
                                        ) ) }
                                    </Col>
                                </Row>
                                :
                                <></> }
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <ShownyBuns imageGiven={ upload0 } /> 
                            </Col>
                        </Row>
                    </Col>
                </Row> :
                <Row>
                <Col>
                    <PloderBuns handleUpload={ handleUpload } /> 
                </Col>
                </Row> }




            </Container>
        </div>
    );
}

export default App;