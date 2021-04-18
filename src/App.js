import React , { useEffect , useState } from 'react';
import './App.css';
import { 
        Container ,
        Row ,
        Col ,
        Image ,
        Button }        from 'react-bootstrap';
import PloderBuns       from './components/plodybuns.jsx';
import axios            from 'axios';

const plateBegin =      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">`;
const plateEnding =     `</svg>`;


function getStyleFromFull( svgCont ) {
    let try0 = /\<style\>(.+?)<\/style\>/;
    var putts = ''
    if ( try0.test( svgCont ) ) {
        putts = svgCont.match( try0 )[ 1 ];
        console.log( 'try0' );
    // } else if ( try1.test( svgCont ) ) {
    //     putts = svgCont.match( try1 )[ 0 ];
    } else {
        console.log( 'dung putts' );
    }
    console.log( putts );
    return putts;
};

function getClassnameFromPath( path ) {
    let try1 = /class\=/
    var ans = '';
    if ( try1.test( path ) ) {
        ans = path.match( try1 )[ 0 ];
    }
    console.log( ans );
    return ans
}
function getColorsFromPath( path ) {
    let try0 = /fill\=\"#([A-Za-z0-9]{4,8})\"/;
    let try1 = /fill\:\#([0-9A-Za-z]{1,8})/;
    let try2 = /\<style\>(.+?)\<\/style\>/
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
    return <img style={ { 
        position : 'fixed' ,
        top : '60px' ,
        right : '0px' ,
        opacity : '.5'
} }  width='300' src={ urlSvgPath } alt={ imgInd + 'caca' } />
}


export default function App( ) {

    const [ colors ,    setColors   ] =     useState( [ ] );
    const [ upload ,    setUpload  ] =      useState( null );
    const [ paths ,     setPaths    ] =     useState( [ ] );

    function handleUpload( event ) {
        let plode =     new FormData( );
        let files =     Object.keys( event.target.files )
                        .map( a => ( event.target.files[ a ] ) );
        plode.append(   'file' ,     event.target.files[ 0 ] );
        setUpload(      files[ 0 ] );
        axios(          {
            url :       'http://localhost:3001/upload/' ,
            method :    'post' ,
            data :      plode
        } )
        .then( res => {
            console.log(    res );
            let pats =      res.data.paths;
            // setPaths(       pats );
        } );
    }

    const [ generatedSvg , setGeneratedSvg ] =          useState( );
    const [ genPaths , setGenPaths ] =                  useState( [ ] );

    useEffect( ( ) => {
        async function bob( ) {
            const text =        await ( new Response( upload ) ).text( );
            var pathMatches =   [ ...text.toString( ).matchAll( /(<path.+?>)/g ) ].map( a => ( a[ 1 ] ) );
            var pathColors =    pathMatches.map( a => ( getColorsFromPath( a ) ) );
            var svgsFromPaths = pathMatches.map( y => ( plateBegin + y + plateEnding ) );
            var styles = getStyleFromFull( text );
            console.log( styles );

            setColors( pathColors );
            setPaths( pathMatches );
            setGenPaths( svgsFromPaths );
            console.log( text );
            console.log( pathMatches );        
        };
        bob( );

    } , [ upload ] )



    return (
        <Container>
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <PloderBuns handleUpload={ handleUpload } /> 
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            { upload && <Image width='200' src={ window.URL.createObjectURL( upload ) } alt='upload' /> }
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
                            <Row>
                                {
                                genPaths.map( ( gp , gpi ) => (
                                    <PoppedOutBitch
                                        imgText={ gp } imgInd={ gpi } />
                                ) )
                                }
                            </Row>
                            :
                            <></>
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            { paths.length > 0
                            ? 
                            <Row className='justify-content-md-center'>
                                <Col
                                xs={ 10 }>
                                    { paths.map( ( path , ind ) => (
                                    <Row key={ ind + 'RowPath' } >
                                        <Col
                                            style={ { 
                                                fontSize : '.8rem' , 
                                                marginBottom : '.9rem'
                                            } }
                                            >
                                            <Button
                                                // onClick={ ( ) => { deletePath( ind ) } }
                                                >
                                                { path }
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
                </Col>
            </Row>
        </Container>
    );
}