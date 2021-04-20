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
// import { execute }      from 'wasm-imagemagick';

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


function getColorsFromPath( path ) {
    let try0 = /fill="#([A-Za-z0-9]{4,8})"/;
    let try1 = /fill:\#([0-9A-Za-z]{1,8})/;
    var answer = '#nadabish';
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
    let blob = new Blob( [ imgText ] , { type : 'image/svg+xml' } );
    let urlSvgPath = URL.createObjectURL( blob );
    return <img key={ 'poptoutbish' + imgInd }
                width='300' 
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

            var pathMatches =   [ ...text.toString( ).matchAll( /(<path.+?>)/g ) ]
                                    .map( a => ( { 
                                        text : a[ 1 ] , 
                                        className : /class=/.test( a[ 1 ] ) 
                                            ? a[ 1 ].match( /class="(.+?)"/ )[ 1 ] 
                                            : '' 
                                        } ) )
                                    .filter( f => ( 
                                        /d="/.test( f.text ) 
                                        && f.text.match( /d="(.+?)"/ )[ 1 ].length > 40 
                                    ) );
            
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
                psObject[ q[ 0 ] ] = q[ 1 ] ;
            } );
            console.log( psObject )
            if ( parsedStyles.length > 0 ) {
                pathMatches.forEach( ( p , q ) => {
                    if ( p.className !== '' ) {
                        let psq = typeof psObject[ p.className ] !== 'undefined' 
                                    ? psObject[ p.className ].match( /fill:(.+?)\}/ )[ 1 ]
                                    : '';
                        console.log( p.className );
                        console.log( psq );
                        console.log( 'shaway' );
                        pathMatches[ q ][ 'fill' ] = psq;
                    }
                } )
            }
            // UPLOAD IS THE FILE OBJECT
            setSvgString( text );
            setStyle( styles );
            setPStyle( psObject );
            setParsedStyle( parsedStyles )
            setColors( pathColors ); // ARRAY OF COLORS IN ART
            setPaths( pathMatches ); // ARRAY OF ALL PATHS 
            console.log( pathMatches );        
        };
        if ( upload ) onceUserUploads( );

    } , [ upload ] );



    const [ filteredColors , setFilteredColors ] = useState( [ ] );
    useEffect( ( ) => {
        var svgsFromPaths = paths.map( y => {
        return ( plateBegin + y.text.replace( 
                /path\s/ , 
                'path fill="' + y.fill + '" ' )
            + plateEnding ) } );
            setGenPaths( svgsFromPaths ); // ARRAY OF SVG STRINGS

        
                
        const filterColors = paths
            .filter( f => { 
                if ( 
                    typeof f.fill !=='undefined' && 
                    f.fill.length > 0 &&
                    !colsNow.includes( f.fill ) ) { 
                        colsNow.push( f.fill ); 
                        return true;
                    } else { 
                        return false;
                };} )
            .map( m => ( m.fill ) );
        console.log( 'fills:::' )
        console.log( filteredColors );
        setFilteredColors( filterColors )


        } , [ paths ] );



        function deleteOnePath( ind ) {
            let tempPs = [ ...paths ];
            tempPs.splice( ind , 1 );
            setPaths( tempPs );
        }

    function handleColorPick( oldInd , newCol ) {
        let tempPaths =             [ ...paths ];
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


    var colsNow = [ ];




    return (

        <Container
            style={ { 
                display : 'none' , 
                minHeight : '100vh' , 
                backgroundColor : !upload 
                    ? 'black' : 'white'
            } } >
            <Row style={ { zIndex : 9999 , position : 'fixed' , top : '0px' , height : '200px' } } >
                <Col>

                    <Row>
                        <Col>
                            { !upload && 
                            <PlodingRear  handleUpload={ storeUploadInBrowser } /> 
                            }
                        </Col>
                    </Row>


                    <Row>
                        { 
                        upload && 
                        <Col style={ { 
                            backgroundColor : 'white' ,
                            border : '1px solid gray' ,
                            borderRadius : '.5rem' ,
                            position : 'fixed'  ,
                            top : '0px' ,
                            left : '10px'
                        } }
                            >
                            <Row>
                                <Col style={ { 
                                    backgroundColor : 'white' ,
                                    textAlign : 'center' ,
                                    fontSize : '1.8rem' ,
                                    fontWeight : 600
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
                    </Row>






                    <Row style={ { zIndex : 9999 , position : 'fixed' , top : '0px' , height : '200px' } } >
                        { 
                        upload && 
                        <Col style={ { 
                            // border : '1px solid gray' ,
                            // borderRadius : '.5rem' ,
                            position : 'fixed' ,
                            // top : '10px' ,
                            right : '0px' 
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

                            {
                            genPaths.length > 0 
                            ?
                            <Row 
                                style={ { position : 'relative' } }
                                onClick={ handleGenSvgClick }
                                >
                                { genPaths.map( ( gp , gpi ) => (
                                <Col
                                    className='bordered' 
                                    key={ gpi + 'poppedOwtBish' }
                                    style={ 
                                        // genSvgsFixed 
                                        // ? fixedStyle :
                                         {
                                             position : 'fixed' ,
                                             right : '5px' ,
                                            //  top : '5px' ,
                                            //  top : '-30px' ,
                                            minHeight : '30px' ,
                                            // width : '300px' , 
                                            fontWeight : '500' , 
                                            color : 'red' ,
                                            textAlign : 'center' }
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
                            <Row></Row>
                            }
                        </Col>
                        }
                    </Row>

                </Col>
            </Row>





            <Row
            // style={ { marginTop : '340px'  } }
             >
                <Col>
             

                {/* F I L L S Z */}
                {/* F I L L S Z */}
                {/* F I L L S Z */}
                {
                paths.length > 0
                ?
                paths.map( ( c , ind ) => (
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
                                colors={ filteredColors }
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









                {
                [
                    [ style , 'Style' ] ,
                    [ colors , 'Colors From Path' ] ,
                    [ paths , 'Paths' ] ,
                    // [ paths.map(p=>(p.fill)), 'Colors From Style' ]
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
                                                onClick={ ( ) => { deleteOnePath( ind ) } }
                                                >
                                                { typeof path === 'string' 
                                                    ? path.slice( 0 , 80 ) 
                                                    : 'len: '
                                                        + path.text.length 
                                                        + '\n'+ path.text.slice( 0 , 80 )
                                                }
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
                    
                    { 
                    paths.length > 0
                    ? 
                    paths.map( ( p , i ) => ( <Row key={i+'rp'}>
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