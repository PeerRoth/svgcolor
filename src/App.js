import React , { useEffect , useState } from 'react';
import './App.css';
import { 
        Container ,
        Row ,
        Col ,
        Image ,
        Button }        from 'react-bootstrap';
import PloderBuns       from './components/plodybuns.jsx';
// import axios            from 'axios';

const plateBegin =      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">`;
const plateEnding =     `</svg>`;






var initFixedStyle= { 
    position : 'absolute' ,
    top: '30' ,
    right : '0' ,
    width : '300px' ,
    height : '200px'
}



function getStyleFromFull( svgCont ) {
    let try0 = /<style>(.+?)<\/style>/;
    if ( try0.test( svgCont ) ) {
        console.log( 'try0' );
        return svgCont.match( try0 )[ 1 ];
    } else {
        console.log( 'dung putts' );
        return false;
    }
};

function getClassnameFromPath( path ) {
    let try1 = /class=/
    var ans = '';
    if ( try1.test( path ) ) {
        ans = path.match( try1 )[ 0 ];
    }
    console.log( ans );
    return ans
};


function getColorsFromPath( path ) {
    let try0 = /fill="#([A-Za-z0-9]{4,8})"/;
    let try1 = /fill:#([0-9A-Za-z]{1,8})/;
    // let try2 = /<style\(.+?)<\/style>/
    var answer = '#ffffff';
    if ( try0.test( path ) ) {
        answer = path.match( try0 )[ 1 ];
        console.log( answer );
    } else if ( try1.test( path ) ) {
        answer = path.match( try1 )[ 1 ];
        console.log( answer );
    } else {
        console.log( answer );
    }
    return answer;
}



function PoppedOutBitch( props ) {
    const { imgText , imgInd } = props;
        let blob =          new Blob( [ imgText ] , { type : 'image/svg+xml' } );
        let urlSvgPath =    URL.createObjectURL( blob );
    return <img
                key={ 'poptoutbish' + imgInd }
                width='300' src={ urlSvgPath } alt={ imgInd + 'caca' } 
            />
}



export default function App( ) {

    const [ colors ,        setColors   ] =     useState( [ ] );
    const [ upload ,        setUpload  ] =      useState( null );
    const [ paths ,         setPaths    ] =     useState( [ ] );
    const [ genSvgsFixed ,  setGenSvgsFixed ] = useState( true );

    function storeUploadInBrowser( event ) {
        let plode =     new FormData( );
        let files =     Object.keys( event.target.files )
                        .map( a => ( event.target.files[ a ] ) );
        plode.append(   'file' ,     event.target.files[ 0 ] );
        setUpload(      files[ 0 ] );
    }

    const [ generatedSvg ,  setGeneratedSvg ] =     useState( );
    const [ genPaths ,      setGenPaths ] =         useState( [ ] );
    const [ style ,         setStyle ] =            useState( [ ] );
    const [ parsedStyle ,   setParsedStyle ] =      useState( [ ] )
    const [ pStyle ,        setPStyle ] =           useState( );
    const [ fixedStyle , setFixedStyle ] = useState( initFixedStyle );
    const [ svgString , setSvgString ] = useState( '' );

    useEffect( ( ) => {
        async function onceUserUploads( ) {
            const text =        await ( new Response( upload ) ).text( );
            console.log( text );

            var pathMatches =   [ ...text.toString( ).matchAll( /(<path.+?>)/g ) ]
                                    .map( a => {
                                        let retObj = { text : '' , className : '' }
                                        if ( /class=/.test( a[ 1 ] ) ) { retObj.className = a[ 1 ].match( /class="(.+?)"/ )[ 1 ]; }
                                        retObj.text = a[ 1 ];
                                        return retObj;
                                    } );
            
            var pathColors =    pathMatches
                                    .map( a => ( getColorsFromPath( a ) ) );

            var styles =        getStyleFromFull( text )
                                ? getStyleFromFull( text ).split( '.' )
                                    .filter( f => ( /[0-9A-Za-z]/.test( f ) ) )
                                : [ 'null' , 'null' , 'null' ];
            console.log( styles );

            let parsedStyles = styles.map( m => {
                let psArray = m.split( '{' );
                return { [ psArray[ 0 ] ] : psArray[ 1 ] } 
            } );

            var psObject = { };
            styles.forEach( p => {
                let q = p.split( '{' );
                psObject[ q[ 0 ] ] = q[ 1 ] 
            } );
            console.log( psObject )
            
            if ( parsedStyles.length > 0 ) {
                pathMatches.forEach( ( p , q ) => {
                    if ( p.className !== '' ) {
                        let psq = psObject[ p.className ].match( /fill:(.+?)\}/ )[ 1 ];
                        console.log( p.className )
                        console.log( psq )
                        console.log( 'shaway' );
                        pathMatches[ q ][ 'fill' ] = psq;
                    }
                } )
            }

            var svgsFromPaths = pathMatches.map( y => {
                                    return ( plateBegin + y.text.replace( 
                                            /path\s/ , 
                                            'path fill="' + y.fill + '" ' )
                                        + plateEnding ) } );

            // UPLOAD IS THE FILE OBJECT
            setSvgString( text );
            setStyle( styles );
            setPStyle( psObject );
            setParsedStyle( parsedStyles )
            setColors( pathColors ); // ARRAY OF COLORS IN ART
            setPaths( pathMatches ); // ARRAY OF ALL PATHS 
            setGenPaths( svgsFromPaths ); // ARRAY OF SVG STRINGS
            console.log( pathMatches );        
        };
        if ( upload ) onceUserUploads( );

    } , [ upload ] );


    function handleGenSvgClick( ) {
        console.log( genSvgsFixed );
        setGenSvgsFixed( !genSvgsFixed );
    }
    
    
    function format( strin , typ ) {
        let newStrin = strin
                        .replace( /</g , '\n\n<' );
        return newStrin;
    }
    
    return (

        <Container>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <PloderBuns handleUpload={ storeUploadInBrowser } /> 
                        </Col>
                    </Row>

                    <Row>
                        <Col style={ { 
                            border : '1px solid gray' ,
                            borderRadius : '.5rem' } }
                            >
                            { 
                            upload && 
                            <Image width='300' 
                                src={ window.URL.createObjectURL( upload ) } 
                                alt='upload' 
                            /> 
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Row>
                        <Col>
                            {
                            genPaths.length > 0 
                            ?
                            <Row onClick={ handleGenSvgClick } >
                                { genPaths.map( ( gp , gpi ) => (
                                    <Col
                                        className='bordered' 
                                        key={ gpi + 'poppedOwtBish' }
                                        style={ genSvgsFixed 
                                            ? fixedStyle : { width : '300px' , fontWeight : '500' , color : 'red' }
                                        } >
                                        { gpi }
                                        <PoppedOutBitch
                                            genSvgsFixed={ genSvgsFixed }
                                            setGenSvgsFixed={ setGenSvgsFixed }
                                            imgText={ gp } imgInd={ gpi } />
                                    </Col>
                                ) ) }
                            
                            </Row>
                            :
                            <></>
                            }
                        </Col>
                    </Row>

                {
                [
                    [ style , 'Style' ] ,
                    [ colors , 'Colors' ] ,
                    [ paths , 'Paths' ]
                ].map( ( rodstewart , pod ) => (
                    <Row key={ pod + 'RowPath' } >
                        <Col>
                            { rodstewart[ 0 ].length > 0
                            ? 
                            <Row className='justify-content-md-center'>
                                <Col
                                xs={ 10 }>
                                    <Row>
                                        <Col style={ { fontWeight : '600' } }>
                                            { rodstewart[ 1 ] }
                                        </Col>
                                    </Row>
                                    { rodstewart[ 0 ].map( ( path , ind ) => (
                                    <Row key={ ind + 'soobraw' }>
                                        <Col
                                            style={ { 
                                                fontSize : '.8rem' , 
                                                marginBottom : '.9rem'
                                            } }
                                            >
                                            <Button
                                                // onClick={ ( ) => { deletePath( ind ) } }
                                                >
                                                { typeof path === 'string' 
                                                ? 'len: ' + path.length + '\n'+ path.slice( 0 , 80 ) 
                                                : 'len: ' + path.text.length + '\n'+ path.text.slice( 0 , 80 ) }
                                            </Button>
                                        </Col>
                                    </Row>
                                    ) ) }
                                </Col>
                            </Row>
                            :
                            <></> }
                        </Col>
                    </Row>
                ) ) }

                <Row>
                    <Col>
                        { svgString.length > 0 
                        ? <pre className='coderBabe'>
                            <code>
                                { format( svgString , 'svg' ) }
                            </code>
                        </pre> : <></> }
                    </Col>
                </Row>

                </Col>
            </Row>
        </Container>
    );
}