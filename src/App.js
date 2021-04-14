import React , { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
        Container ,
        Image ,
        Row ,
        Col ,
        Button
    } from 'react-bootstrap';
    
import SvgPlace from './components/svgplace.jsx';



function SvgDisplay( props ) {
    const { svgs } = props;
    return (
        <Col>
        {
        svgs.map( ( a , b ) => {
        return (
            <Row>
                <Image src={ a.image } />
            </Row>
        )
        } )
        }
        </Col>
    )
}



function App( ) {

    const [ color0 , setColor0 ] = useState( '4b79d4' );
    const [ color1 , setColor1 ] = useState( '4b79d4' );
    const [ color2 , setColor2 ] = useState( '4b79d4' );
    const [ color3 , setColor3 ] = useState( '4b79d4' );




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
            </Container>
        </div>
    );
}

export default App;