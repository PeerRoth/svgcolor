import React , { useEffect , useState } from 'react';
import './App.css';
import { 
        Container ,
        Row ,
        Col ,
        Image ,
        Button }        from 'react-bootstrap';
import PloderBuns       from './components/plodybuns.jsx';
import ColorPacker      from './components/colorpacker.jsx';
import PlodingRear      from './components/plodingrear.jsx';
// import PlodeFiller from './components/plodefiller.jsx';
// import { execute }      from 'wasm-imagemagick';
// import { buildInputFile, execute, loadImageElement } from 'wasm-imagemagick';
import * as Magick from 'wasm-imagemagick';
import logo from './logo.svg';
import image1 from './image1.png';
import fn from './fn.png';
import filler from './filler.svg'
// import axios            from 'axios';
const plateBegin =      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">`;
const plateEnding =     `</svg>`;







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


function getColorFromPath( path ) {
    let try0 = /fill="#([A-Za-z0-9]{3,7})"/;
    let try1 = /fill:#([0-9A-Za-z"]{3,8})"?\s?\/?/;
    var answer = '';
    console.log( path )
    if ( try0.test( path ) ) {
        console.log( try0 )
        answer = path.match( try0 )[ 1 ];
        console.log( answer );
    } else if ( try1.test( path ) ) {
        console.log( try1 )
        answer = path.match( try1 )[ 1 ];
        console.log( answer );
    } else {
        console.log( answer );
    }
    return answer;
}




function PoppedOutBitch( props ) {
    const { imgText , imgInd } = props;
    let blob = new Blob( [ imgText ] , { type : 'image/svg+xml' } );
    let urlSvgPath = URL.createObjectURL( blob );
    return <img key={ 'poptoutbish' + imgInd }
                width='400'
                height={ props.ht ? props.ht : '' }
                src={ urlSvgPath }
                alt={ imgInd + 'caca' }
            />
}



export default function App( ) {

    const [ colors ,        setColors   ] =         useState( [ ] );
    const [ upload ,        setUpload  ] =          useState( null );
    const [ paths ,         setPaths    ] =         useState( [ ] );
    const [ genSvgsFixed ,  setGenSvgsFixed ] =     useState( true );
    const [ genPaths ,      setGenPaths ] =         useState( [ ] );
    const [ style ,         setStyle ] =            useState( [ ] );
    const [ parsedStyle ,   setParsedStyle ] =      useState( [ ] )
    const [ pStyle ,        setPStyle ] =           useState( );
    // const [ fixedStyle ,    setFixedStyle ] =       useState( initFixedStyle );
    const [ svgString ,     setSvgString ] =        useState( '' );
    const [ pathObjects ,     setPathObjects ] =        useState( [ ] );
    const [ bigOne ,     setBigOne ] =        useState( '' );
    const [ selectedPath , setSelectedPath ] = useState( 0 );
    const [ currentColorIndex , setCurrentColorIndex ] = useState( 0 );




    function storeUploadInBrowser( event ) {
        let plode =     new FormData( );
        let files =     Object.keys( event.target.files )
                        .map( a => ( event.target.files[ a ] ) );
        plode.append(   'file' ,     event.target.files[ 0 ] );
        setUpload(      files[ 0 ] );
    };


  

    useEffect( ( ) => {
        async function onceUserUploads( ) {
            const text = await ( new Response( upload ) ).text( );
            console.log( text );

            // make array of path strings
            var pathMatches =   [ ...text.toString( ).matchAll( /(<path.+?>)/g ) ].map( m => ( m[ 1 ] ) );
            console.log( pathMatches )
            // make array of { [class] : fill }'s
            var styles =        getStyleFromFull( text )
                                ? getStyleFromFull( text )
                                    .split( '.' )
                                    .filter( f => ( /[0-9A-Za-z]/.test( f ) ) )
                                : [ ];

            var matchObjects = pathMatches
                                .map( a => ( { text : a } ) );

                matchObjects = matchObjects
                                .map( a => ( {
                                    ...a ,
                                    len : a.text.length
                                } ) );

                matchObjects = matchObjects
                                .map( a => ( { 
                                    ...a , 
                                    className : /class=/.test( a.text ) 
                                        ? a.text.match( /class="(.+?)"/ )[ 1 ] 
                                        : '' } ) );

                matchObjects = matchObjects
                                .map( a => ( { 
                                    ...a ,
                                    fill : /fill/.test( a.text )
                                        ? getColorFromPath( a.text )
                                        .replace( /"/g , '' )
                                        : /class=/.test( a.text )
                                            ? styles
                                            .filter( s => ( new RegExp( a.text.match( /class="(.+?)"/ )[ 1 ] , 'i' )
                                            .test( s ) ) )[ 0 ]
                                            .match( /#([A-Za-z0-9]{3,6})/ )[ 1 ]
                                            .replace( /"/g , '' )
                                            : 'fff'
                                } ) );


                matchObjects = matchObjects
                                .map( a => ( { 
                                    ...a ,
                                    d : /d="/.test( a.text )
                                        ? a.text.match( /d="(.+?)"/ )[ 1 ]
                                        : ''
                                } ) );

                matchObjects = matchObjects
                                .map( a => ( { 
                                    ...a ,
                                    rotation : /rotate\((.+?)\)"/.test( a.text )
                                        ? a.text.match( /rotate\((.+?)\)"/ )[ 1 ]
                                        : ''
                                } ) );

                matchObjects = matchObjects
                                .map( a => ( { 
                                    ...a ,
                                    p : a.text
                                    .replace( /style=".+?"/g , '' )
                                    .replace( /class=".+?"/g , '' )
                                } ) );

                matchObjects = matchObjects
                                .map( ( a , b ) => ( { 
                                    ...a ,
                                    index : b } ) );

            var pathColors =    matchObjects
                                .map( a => ( '#' + a.fill ) )
                                .reduce( ( unique , item ) =>
                                    unique.includes( item ) 
                                        ? unique 
                                        : [ ...unique , item ] , [ ] )
                                .sort( ( c , d ) => ( c.index > d.index ? 1 : c.index === d.index ? 0 : -1 ) );


            console.log( styles );

            var oneBigOneP = '<svg xmlns="http://www.w3.org/2000/svg">\n\n' 
                + matchObjects
                    .map( mo => ( mo.p.replace( /<path\s/ig , '<path fill="#' + mo.fill + '" ' ) ) )
                    .join( '\n\n' )
                + '\n\n</svg>';

            console.log( oneBigOneP );
            setBigOne( oneBigOneP );
            

            // UPLOAD IS THE FILE OBJECT
            setSvgString( text );
            setStyle( styles );
            // setPStyle( psObject );
            // setParsedStyle( parsedStyles )
            setColors( pathColors ); // ARRAY OF COLORS IN ART
            setPaths( pathMatches ); // ARRAY OF ALL PATHS 
            setPathObjects( matchObjects );
            console.log( pathMatches );        
        };
        if ( upload ) onceUserUploads( );

    } , [ upload ] );




    useEffect( ( ) => {
        var svgsFromPaths = plateBegin 
        + pathObjects.map( y => {
        return (  
            '<path ' 
                + y.p
                ) } )
            + plateEnding
            setGenPaths( svgsFromPaths ); // ARRAY OF SVG STRINGS

        } , [ pathObjects ] );



    function deleteOnePath( ind ) {
        let tempPs = [ ...pathObjects ];
        tempPs.splice( ind , 1 );
        setPaths( tempPs );
    }


    function handleColorPick( oldInd , newCol ) {
        let tempPaths =             [ ...pathObjects ];
        let targetColor =           newCol[ 0 ] === '#' ? newCol.slice( 1 ) : newCol;
        tempPaths[ oldInd ].fill =  targetColor;
        setPathObjects( tempPaths );
        let tempGenPaths = [ ...genPaths ];
        tempGenPaths[ oldInd ] = tempGenPaths[ oldInd ]
                                .replace( 
                                    new RegExp( tempPaths[ oldInd ].fill , 'g' ) ,
                                    newCol );
        setGenPaths( tempGenPaths );
    }



    function handleGenSvgClick( ) {
        console.log( genSvgsFixed );
        setGenSvgsFixed( !genSvgsFixed );
    }
    
    


    function format( strin , typ ) {
        let newStrin = strin
                        .replace( /</g , '\n\n<' );
        return newStrin;
    }


    function selectPath( inn ) {
        console.log( 'SELECTED SVG PATH : ' + inn );
        console.log( 'fill : ' + pathObjects[ inn ].fill );
        setSelectedPath( inn );
        let croler = new RegExp( pathObjects[ inn ].fill );
        var cindy = 0;
        for ( var c = 0; c < colors.length; c ++ ) {
            if ( croler.test( colors[ c ] ) )  {
                cindy = c;
                break;
            } 
        };
        setCurrentColorIndex( cindy );
    };

    function setColorFromBelow( no ) {
        let croler = new RegExp( no.replace( '#' , '' ) );
        var cindy = 0;
        for ( var c = 0; c < colors.length; c ++ ) {
            if ( croler.test( colors[ c ] ) )  {
                cindy = c;
                break;
            } 
        };
        console.log( cindy )
        setCurrentColorIndex( cindy )
    }


    return (
        <Container>

            <Row>
                <Col>
                    { !upload && 
                    <PlodingRear  
                        filler={ filler }
                        handleUpload={ storeUploadInBrowser }
                    /> 
                    }
                </Col>
            </Row>



            <Row>
                <Col 
                    style={ { 
                        fontSize : '.25rem' , 
                        height : '300px' , 
                        width : '55vw' , 
                        position : 'fixed' , 
                        left : '0vw' ,
                        top : '500px' } }>
                    <Image src={ URL.createObjectURL( new Blob( [ bigOne ] , { type : 'image/svg+xml' } ) ) }
                        alt={ '99' } height={ 300 } width='400'/>
                    { bigOne.toString( ) }
                </Col>
            </Row>



            <Row >
                <Col>
                    { upload &&
                    <ColorPacker 
                    currentColorIndex={ currentColorIndex }
                        colors={ colors }
                        handleColorPick={ handleColorPick }
                        selectedPath={ selectedPath }
                        setColorFromBelow={ setColorFromBelow }
                    />
                    }
                    { upload &&
                    <svg style={ { 
                        position : 'fixed' , 
                        top : '0px' , 
                        right : '0px' , 
                        height : '300px' , 
                        width : '350px' 
                    } } >
                        { 
                        pathObjects.map( ( po , ro ) => ( 
                        <a  id={ 's' + ro + 'svg' } 
                            key={ ro + 'svgkey' } 
                            style={ { cursor : 'pointer' } } 
                            onClick={ ( ) => { selectPath( ro ) } } 
                            >
                            <path fill={ '#' + po.fill } d={ po.d } />
                        </a> 
                        ) )
                        }
                    </svg>
                    }
                </Col>
            </Row>



            {/* S V G  - - T E X T */}
            <Row style={ { marginTop : '1200px' } } >
                <Col>
                    { svgString.length > 0 
                    ? <pre className='coderBabe'>
                        <code>
                                { svgString }
                        </code>
                    </pre> : <></> }
                </Col>
            </Row>



        </Container>
    );
}