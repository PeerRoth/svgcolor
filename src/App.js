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
import PathPicker from './components/pathpicker.jsx'
// import { execute }      from 'wasm-imagemagick';
// import { buildInputFile, execute, loadImageElement } from 'wasm-imagemagick';
import * as Magick from 'wasm-imagemagick';
import logo from './logo.svg';
import image1 from './image1.png';
import fn from './fn.png';
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

            var pathColors =    matchObjects
                                .map( a => ( a.fill ) );


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
        var svgsFromPaths = pathObjects.map( y => {
        return ( plateBegin 
            + 
            // /fill/.test( y.text )
            //     ? 
                y.text.replace( 
                /path\s/ , 
                'path fill="#' + y.fill + '" ' )
            + plateEnding ) } );
            setGenPaths( svgsFromPaths ); // ARRAY OF SVG STRINGS

        } , [ pathObjects ] );



    function deleteOnePath( ind ) {
        let tempPs = [ ...pathObjects ];
        tempPs.splice( ind , 1 );
        setPaths( tempPs );
    }

    function handleColorPick( oldInd , newCol ) {
        let tempPaths =             [ ...pathObjects ];
        tempPaths[ oldInd ].fill =  newCol;
        setPaths( tempPaths );

        let tempGenPaths = [ ...genPaths ];
        tempGenPaths[ oldInd ] = tempGenPaths[ oldInd ]
                                    .replace( 
                                        new RegExp( tempPaths[ oldInd ].fill , 'g' ) ,
                                        newCol
                                     );
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





const [ selectedPath , setSelectedPath ] = useState( 0 )





function selectPath( inn ) {
    console.log( 'SELECTED SVG PATH : ' + inn );
    console.log( 'fill : ' + pathObjects[ inn ].fill );
    setSelectedPath( inn );
}

    return (

        <Container>


            
            
            
            
            <Row style={ { 
                zIndex : 9999 , 
                position : 'fixed' , 
                right : '0px' , 
                top : '0px' , 
                height : '200px' 
                } } >
              
                <Col>

                    <Row>
                        <Col>
                            { !upload && 
                                <PlodingRear  handleUpload={ storeUploadInBrowser } /> 
                            }
                        </Col>
                    </Row>


                    {/* <Row>
                        { 
                        upload && 
                        
                        <Col style={ { 
                                backgroundColor : 'white' ,
                                border : '1px solid gray' ,
                                borderRadius : '.5rem' ,
                                position : 'fixed'  ,
                                top : '2vh' ,
                                left : '10px' ,
                                width : '48vw'
                            } }
                            >

                            <Row>
                                <Col style={ { 
                                    backgroundColor : 'white' ,
                                    textAlign : 'center' ,
                                    fontSize : '1.8rem' ,
                                    fontWeight : 600 ,
                                    fontFamily : 'Montserrat'
                                    } }>
                                    Original
                                </Col>
                            </Row>

                            <Row>
                                <Col style={ { textAlign : 'left' } }>
                                <Image width='300' 
                                    src={ window.URL.createObjectURL( upload ) } 
                                    alt='upload' 
                                    />
                                </Col>
                            </Row>
                        </Col>
                        }
                    </Row> */}



                    <Row style={ { zIndex : 9999 , position : 'fixed' , right : '0px' , top : '0px' , height : '200px' } } >
                        { 
                        upload && 
                        <Col style={ { 
                            backgroundColor : 'white' ,
                            border : '1px solid gray' ,
                            borderRadius : '.5rem' ,
                            position : 'fixed' ,
                            top : '2vh' ,
                            right : '0px' ,
                            width : '48vw'
                            } }
                            >
                            <Row>
                                <Col style={ { 
                                    textAlign : 'center' ,
                                    fontSize : '1.8rem' ,
                                    fontWeight : 600 ,
                                    marginLeft : 'auto' ,
                                    marginRight : 'auto' ,
                                    width : '200px'
                                    } }>
                                    Composite
                                </Col>
                            </Row>


                <Row>
                    <Col 
                        style={ { fontSize : '.25rem' , height : '300px' , width : '40vw' , position : 'fixed' , top : '300px' , right : '30vw' } }>
                        <Image src={ URL.createObjectURL( new Blob( [ bigOne ] , { type : 'image/svg+xml' } ) ) } alt={ '99' } height={ 300 } />
                        { bigOne.toString( ) }
                    </Col>
                </Row>



















                            {
                            genPaths.length > 0 
                            ?
                            <Row 
                                // style={ { position : 'relative' } }
                                onClick={ handleGenSvgClick }
                                >
                                { genPaths.map( ( gp , gpi ) => (
                                <Col
                                    className='bordered' 
                                    key={ gpi + 'poppedOwtBish' }
                                    style={ {
                                             position : 'fixed' ,
                                             right : '5px' ,
                                             width : '48vw' ,
                                             textAlign : 'center' ,
                                             top : '2vh'

                                            // minHeight : '30px' ,
                                            // fontWeight : '500' , 
                                            // color : 'red' ,
                                            // textAlign : 'center' 
                                        } } >
                                    { gpi }
                                    <PoppedOutBitch
                                        style={ { textAlign : 'center' } }
                                        genSvgsFixed={ genSvgsFixed }
                                        setGenSvgsFixed={ setGenSvgsFixed }
                                        imgText={ gp } imgInd={ gpi } />
                                </Col>
                                ) ) }
                            </Row>
                            :
                            <Row></Row>
                            }
                        </Col>
                        }
                    </Row>

                </Col>
            </Row>














            <Row
                style={ { 
                    marginTop : '300px'
                } } >

                <PathPicker 
                    paths={ pathObjects }
                    genPaths={ genPaths }
                    />
            </Row>


















            <Row
            // style={ { marginTop : '340px'  } }
             >
                <Col>
             

                {/* F I L L S Z */}
                {/* F I L L S Z */}
                {/* F I L L S Z */}
                {
                pathObjects.length > 0
                ?
                pathObjects.map( ( c , ind ) => (
                    <Row key={ ind + 'soobraw' }
                        style={ { 
                            paddingBottom : '2rem' , 
                            paddingLeft : '1rem' ,
                            borderBottom : '1px solid gray' } } 
                        >
                        <Col style={ { 
                                fontSize : '.8rem' , 
                                marginBottom : '.9rem' ,
                            } } 
                            >
                            <h3 style={ { 
                                width : '240px' , 
                                border : '2px solid gray' ,
                                borderRadius : '.7rem' ,
                                padding : '.6rem'
                                } } >

                                { '((' + ind + '))  ' }

                                { typeof c[ 'fill' ] !== 'undefined' 
                                    ? ' ' + c.fill 
                                    : 'fillzers' }

                            </h3>
                        </Col>


                        

                        <Col>
                            <ColorPacker
                                colors={ colors }
                                color0={ c.fill }
                                handleColorPick={ handleColorPick }
                                indy={ ind }
                                />
                        </Col>
                    </Row>
                ) )
                : 
                <></>   
                }









                { pathObjects.length > 0 ? <>{
                [
                    [ style , 'Style' ] ,
                    [ colors , 'Colors From Path' ] ,
                    [ pathObjects , 'Paths' ] ,
                    // [ pathObjects.map(p=>(p.fill)), 'Colors From Style' ]
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
                                                { '  ' + pod + ' - ' }{ ind + '  ' }
                                            <Button
                                                style={ { textAlign : 'left' } }
                                                onClick={ ( ) => { deleteOnePath( ind ) } }
                                                >
                                                    { rodstewart[ 1 ] === 'Paths' 
                                                    ? 
                                                    '**fill : ' + path.fill 
                                                        + '  \n     **text : ' + path.text.slice( 0 , 80 )
                                                        + '  \n     **len : ' + path.len
                                                        + '  \n     **className : ' + path.className
                                                    :
                                                    path.slice( 0 , 80 )

                                                    
                                                    }
                                                {/* { typeof path === 'string' 
                                                    ? path.slice( 0 , 80 ) 
                                                    : 'len: '
                                                        + path.text.length 
                                                        + '\n'+ path.text.slice( 0 , 80 )
                                                } */}
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
                ) ) }</> : <></> }








<svg style={ { position : 'fixed' , top : '400px' , left : '0px' } }>
{ pathObjects.map( ( po , ro ) => ( <a id={ 's' + ro + 'svg' } key={ ro + 'svgkey' } style={ { transform : 'rotate(45)' , cursor : 'pointer' } } onClick={ ( ) => { selectPath( ro ) } } ><path fill={ '#' + po.fill } d={ po.d } /></a> ) ) }
</svg>

















                <Row>
                    
                    { 
                    pathObjects.length > 0
                    ? 
                    pathObjects.map( ( p , i ) => ( <Row key={i+'rp'}>
                        <Col xs={ 4 }>{ i }</Col>
                        <Col>
                        <Row><Col>{ p.fill }</Col></Row>
                        <Row><Col>{ p.className }</Col></Row>
                        <Row><Col><pre className='coderBabe'>{ format( p.text.slice( 0,20 ) ) }</pre></Col></Row>
                        </Col>
                        </Row>
                    ) )
                    : <></>
                    }
                    
                </Row>



<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

                {/* S V G  - - T E X T */}
                {/* S V G  - - T E X T */}
                {/* S V G  - - T E X T */}
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