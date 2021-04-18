import React , { useEffect , useState } from 'react';
import { Row , Col , Image , Button } from 'react-bootstrap';


const svgBoilerPlateBeginning = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">`;
const svgBoilerPlateEnding = `</svg>`


function PoppedOutBitch( props ) {
    const { imgText , imgInd } = props;
        let blob =          new Blob( [ imgText ] , { type : 'image/svg+xml' } );
        let urlSvgPath =    URL.createObjectURL( blob );
    return <img  width='200' src={ urlSvgPath } alt={ imgInd + 'caca' } />
}



export default function ShownyBuns( props ) {

    const [ tempState , setTempState ] = useState( );
    const [ pathsFromUpload , setPathsFromUpload ] = useState( );
    const { imageGiven , paths } = props;
    const [ generatedSvg , setGeneratedSvg ] = useState( );
    const [ genPaths , setGenPaths ] = useState( [ ] );

    useEffect( ( ) => {
        const bobo =    window.URL.createObjectURL( imageGiven );
        let image =     window.document.getElementById( '#xdickstring' );

        async function bob( ) {
            const text = await ( new Response( imageGiven ) ).text( );
            console.log( text );

            var yyy = [ ...text.toString( ).matchAll( /(<path.+?>)/g ) ].map( a => ( a[ 1 ] ) );

            var zzz = yyy.map( y => ( svgBoilerPlateBeginning + y + svgBoilerPlateEnding ) );
            setGenPaths( zzz );



            let svgFromPath0 = svgBoilerPlateBeginning + yyy[ 0 ] + svgBoilerPlateEnding;
            console.log( svgFromPath0 );

            function modifySvg( svgText ) {
                let blob =          new Blob( [ svgText ] , { type : 'image/svg+xml' } );
                let urlSvgPath =    URL.createObjectURL( blob );
                console.log(        image );
                image.src =         urlSvgPath;
                setGeneratedSvg(    urlSvgPath );
                image.addEventListener( 'load' , ( ) => URL.revokeObjectURL( urlSvgPath ) , { once : true } );
            };

            modifySvg( svgFromPath0 );


            setPathsFromUpload( yyy );
            console.log( yyy );        
        };
        bob( );

        setTempState( bobo );

    } , [ ] )

    // setTempState( showImage )
    return (

        <Col>
        
            <Image width='300' src={ tempState } alt='image given' />


            <img id='#xdickstring' width='300' alt='generated svg' />


<Row>
<Col>
{ genPaths.length > 0 
?

<Row>
{ genPaths.map( ( gp , gpi ) => {
    return (

        <PoppedOutBitch style={ { 
            position : 'fixed' ,
            bottom : '0' ,
            left : '0'
        } }
            imgText={ gp } imgInd={ gpi } />

    )
})}    
</Row>
: <></>
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

    )
}