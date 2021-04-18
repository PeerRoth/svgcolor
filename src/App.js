import React , { useEffect , useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { 
        Container ,
        Row ,
        Col ,
        Button
    }                       from 'react-bootstrap';
import PloderBuns           from './components/plodybuns.jsx';
import ShownyBuns           from './components/shownybuns.jsx';
// import SvgPlace             from './components/svgplace.jsx';
import axios                from 'axios';


let svg = `<svg  id="Capa_1"  enable-background="new 0 0 512 512" 
height="512" viewBox="0 0 512 512" width="512"
xmlns="http://www.w3.org/2000/svg"
><path d="m378.266 356.863h-244.532c-5.477 0-10.715-1.012-15.549-2.845l16.316 102.189c4.442 27.822 28.441 48.292 56.614 48.292h129.769c28.174 0 52.172-20.471 56.614-48.292l16.316-102.189c-4.833 1.833-10.071 2.845-15.548 2.845z" fill="#ffd600"/>
    <path d="m378.266 230.341h-244.532c-24.233 0-43.877 19.645-43.877 43.877v38.768c0 24.233 19.645 43.877 43.877 43.877h244.531c24.233 0 43.877-19.645 43.877-43.877v-38.768c.001-24.233-19.643-43.877-43.876-43.877z" fill="#ffff6f"/>
    <circle cx="311.632" cy="284.235" fill="#f90" r="11.804"/>
    <circle cx="200.368" cy="284.235" r="11.804"/></svg>`;


function App( ) {

    const [ colors ,    setColors   ] =     useState( [ ] );
    const [ upload ,   setUpload  ] =       useState( null );
    const [ paths ,     setPaths    ] =     useState( [ ] );
    const [ svgString , setSvgString ] =    useState( svg );

    // useEffect( ( ) => {
    //     function modifySvg( ) {
    //         let blob =      new Blob( [ svgString ] , { type : 'image/svg+xml' } );
    //         let url =       URL.createObjectURL( blob );
    //         let image =     window.document.getElementById( '#ppstring' );
    //         console.log(    image );
    //         image.src =     url;

    //         image.addEventListener( 'load' , ( ) => URL.revokeObjectURL( url ) , { once : true } );
    //     };

    //     modifySvg( );
    // } , [ ] )


    function handleAllColorsChange( c , i ) {
        let tempCols =      [ ...colors ];
        tempCols[ i ] =     c;
        setColors( tempCols );
    }

    async function changeOne( old , nu ) {
        console.log( old , nu );
        axios( {
            url : 'http://localhost:3001/changecolor/' + old + '/' + nu ,
            method : 'get' ,
        } )
        .then( res => {
            console.log( res );
        } )
    }


    function handleUpload( event ) {
        let files = Object.keys( event.target.files ).map( a => ( event.target.files[ a ] ) );
        setUpload( files[ 0 ] );
        let plode =     new FormData( );
        plode.append( 'file' , event.target.files[ 0 ] );

        axios( {
            url : 'http://localhost:3001/upload/' ,
            method : 'post' ,
            data : plode
        } )
        .then( res => {
            console.log( res );
            let pats = res.data.paths;
            setPaths( pats );
        } );
    }


    function deletePath( pthInd ) {
        axios( {
            url : 'http://localhost:3001/deletepath/' + pthInd ,
            method : 'get' ,
        } )
        .then( res => { console.log( res ) } )
    }

    return (
        <Container>
            <Row>
                <Col md={ 5 } >
                    {/* <SvgPlace
                        svg={ logo }
                        setColors={ setColors }
                        colors={ colors }
                        setAllColors={ handleAllColorsChange }
                        changeOne={ changeOne }
                    /> */}
                </Col>

                { upload ?
                <Row>
                    <Col>
                        <Row>
                            <Col>
                            
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <ShownyBuns paths={ paths } imageGiven={ upload } /> 
                            </Col>
                        </Row>
                    </Col>
                </Row> :
                <Row>
                <Col>
                    <PloderBuns handleUpload={ handleUpload } /> 
                </Col>
                </Row> }




        </Row>

        </Container>
    );
}

export default App;