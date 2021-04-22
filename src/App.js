import React , { useEffect , useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
        Container ,
        Row ,
        Col }           from 'react-bootstrap';
import ColorPacker      from './components/colorpacker.jsx';
import PlodingRear      from './components/plodingrear.jsx';
// import * as Magick      from 'wasm-imagemagick';
import filler           from './filler.svg';


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








export default function App( ) {

    const [ colors ,        setColors   ] =                 useState( [ ] );
    const [ upload ,        setUpload  ] =                  useState( null );
    const [ genPaths ,      setGenPaths ] =                 useState( [ ] );
    const [ style ,         setStyle ] =                    useState( [ ] );
    const [ svgString ,     setSvgString ] =                useState( '' );
    const [ pathObjects ,   setPathObjects ] =              useState( [ ] );
    const [ bigOne ,        setBigOne ] =                   useState( '' );
    const [ selectedPath ,  setSelectedPath ] =             useState( 0 );
    const [ currentColorIndex , setCurrentColorIndex ] =    useState( 0 );




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
            // setPaths( pathMatches ); // ARRAY OF ALL PATHS 
            setPathObjects( matchObjects );
            // console.log( pathMatches );   
            console.log( style )     
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



    function deleteOnePath( ) {
        let tempPs = [ ...pathObjects ];
        tempPs.splice( selectedPath , 1 );
        setPathObjects( tempPs );
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

        <Container fluid>
<Row>
    <Col>
        <a href={ 'https://plodes-bucket20445-dev.s3.amazonaws.com/public/FINALS/CATALOGS/QUEUE/T9/DEBCO-2021LOOKBOOK-A-HITEX-MARKETING-225868457.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZWRALFHZ6JKWLO6T%2F20210422%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20210422T044646Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE0aCXVzLWVhc3QtMSJIMEYCIQDw15PjRgIyAD7oai9hDaBKk7fbtb7ZW4ZEzf2uoP6n8wIhAL604rkrxWYMqfc%2Br1fEFlI2k%2BCPb%2Fu7PQd4WJD%2Bx5X9Ks0ECLb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMNjY2ODYxNTEzMjAzIgxC8DQNKX0sjr4dEUgqoQQyAD8KGUdhWDX9INYz%2FTTxcvldU6htGoay8yFyGCiY2N5FzvPvv9I%2F1K1nRdjZcZ9Sf05%2BdJ5I6TTefj8I8JhaxVZymKNAMyIn7XGu1gh6YyfK1Ga%2FYe9r%2Bu8ijpoEJ1poX8Khg6v%2F1ra%2BGDCY3PwlKPrtEpBpWrBO28OoUcWWNUoh0%2FFuMdtDABg8%2F8lUb8BQn6w2SSILmahYILCmAgg9VYmGLlPy79pJlzyHFztTbV5LeNtLN%2FOyXv936iSBsZs5yLmXr7DrD1A3QAn67QwYzzbrVoBoeduHxLy86VlVy1ynDhd0WXtIZoDOxtFUXOdBBs6uc2U6XeMOPnLw%2BgDCHvAOtcS1mfPyWdrWKLhui%2F9OvMR%2BWKobaCAcdNb2laeI6aNIvjP%2Bp%2B16PdcVFDQTL7737uqAdj8heDCg7YgWpTsde5wizvnCOEK0PhqRUDfEm28SS8nhz6WNZjc4LevE3C4bsfxET8oTEc%2BGhFfNwpJyYxPJmLhYywKMpv7j6T9ws7Whaqs0hcd5DCdZvOI004qhKIVxwarMPrMbmktX0voTT28CYbCFUBuLxyiYSwPhRU2eqJ1KgsmSSUZA4%2BFBrkH9BSc%2BFE0n1aFrUo4Zm4ygeqoHNrYvLOGResXXZY3CafRlybCx7Hj6NJDhqitT7LSUBjX4n2J3JcGG7amC6SnmsN2321uyvwr%2BmwcwWrpRDQp76WJhXjIwBM7IUlSNcDDM%2FYOEBjqEAjuoGJfCK4u1sT8nBB%2FjKVVCieAnO%2B%2BQAcn4mVeUnLrTwPFwIsF6gEd9R8gEGrtZ0KgTuZn77nVrcJpC8xDxdzgREbVLnStKaEUaBIDI2%2B1ZGC8DoFWjOjZWyquth3%2B1uSRsVcomGHnmXGWDWgnPPBuExBgzwFemIA%2FB2%2BFoghU8UUPJ6P971LOP%2FTFI1JbUs%2By9AehvAsZ01eroLcYnKYA%2BL7%2BVvLrDCLUpriMwOpP32D0aHLnl790ArXD%2BL5L5qRfF3dTOo68DG0HmzxedvdPUGsUSsZJlTy5%2FisPUCwOEvYLVmAgvC1hwB7BziD20yJ0wlHNfMHx%2BXsgEhBwrLVN2MTq%2B&X-Amz-Signature=c820abf11593d0540bc6a39df48585425a04ed99cb350052c3b7c07fd2ecdfb8&X-Amz-SignedHeaders=host&x-amz-user-agent=aws-sdk-js-v3-%40aws-sdk%2Fclient-s3%2F1.0.0-gamma.8%20Mozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F89.0.4389.128%20Safari%2F537.36%20aws-amplify%2F3.5.5%20js&x-id=GetObject' }>cat</a>
    </Col>
</Row>
            { !upload && 
            <Row
                style={ { height : '100vh' , width : '100vw' } } >
                <Col>
                    <PlodingRear  
                        filler={ filler }
                        handleUpload={ storeUploadInBrowser }
                    /> 
                </Col>
            </Row>
            }




            <Row  >
                
                
                <Col
                    xs={ 12 }
                    sm={ 12 }
                    md={ 6 }
                    lg={ 6 }
                    xl={ 6 }
                    style={ { minHeight : '350px' } }
                >
                    { upload &&
                    <svg style={ { 
                        overflow : 'visible' ,
                        padding : '1rem' ,
                            // position : 'fixed' , 
                            // top : '0px' , 
                            // right : '200px' , 
                            // height : '334px' , 
                            // width : '274px' 
                        } } >
                        { 
                        pathObjects.map( ( po , ro ) => ( 
                        <a  id={ 's' + ro + 'svg' } 
                            key={ ro + 'svgkey' } 
                            style={ { 
                                opacity : ro === selectedPath ? .5 : 1 ,
                                stroke : ro === selectedPath ? 'black' : 'none' ,
                                strokeWidth : ro === selectedPath ? 2 : 'none' ,
                                cursor : 'pointer' } } 
                            onClick={ ( ) => { selectPath( ro ) } } 
                            >
                            <path fill={ '#' + po.fill } d={ po.d } />
                        </a> 
                        ) )
                        }
                    </svg>
                    }
                </Col>
                
                
                <Col
                    xs={ 12 }
                    sm={ 12 }
                    md={ 6 }
                    lg={ 6 }
                    xl={ 6 }
                    style={ { padding : '2rem' } }
                    >
                    { upload &&
                    <ColorPacker 
                    deleteOnePath={ deleteOnePath }
                        currentColorIndex={ currentColorIndex }
                        colors={ colors }
                        handleColorPick={ handleColorPick }
                        selectedPath={ selectedPath }
                        setColorFromBelow={ setColorFromBelow }
                    />
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
};







            {/* <Row>
                <Col 
                    style={ { 
                        fontSize :  '.25rem' , 
                        height :    '300px' , 
                        width :     '55vw' , 
                        position :  'fixed' , 
                        left :      '0vw' ,
                        top :       '500px' } }>
                    <Image src={ URL.createObjectURL( new Blob( [ bigOne ] , { type : 'image/svg+xml' } ) ) }
                        alt={ '99' } height={ 300 } width='400'/>
                    { bigOne.toString( ) }
                </Col>
            </Row> */}

