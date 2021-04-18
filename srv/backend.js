const express =         require( 'express' );
const cors =            require( 'cors' );
const fs =              require( 'fs' );
const path =            require( 'path' );
const multer =          require( 'multer' );
const port =            3001;
const app =             express( );

app.use( cors( ) );
const storage =   path.join( __dirname , 'imageStorage' );

function getCurrentIds( ) {
    var idsAlready =  fs.readdirSync( storage )
                        .filter( f => ( /^\(/.test( f ) && /\)/.test( f ) ) )
                        .map( m => ( m.match( /\(([0-9]{0,9})\)/ )[ 1 ] ) )
                        .sort( ( a , b ) => ( b - a ) );
    
    return idsAlready[ 0 ];
};



function getLogoFile( ) {
    console.log( getCurrentIds( ) )
    const dirdirname =      path.dirname( __dirname );
    const logoFile =        path.join( dirdirname , 'src' , 'logo.svg' );
    const svgContents =     fs.readFileSync( logoFile ).toString( );
    var arrayOfSvgColors =  [ ...svgContents.matchAll( 
                                    /fill\=\"#([A-Za-z0-9]{4,8})\"/g 
                                ) ].map( sc => ( sc[ 1 ] ) );
                            console.log( dirdirname )
                            console.log( logoFile )
                            console.log( arrayOfSvgColors );
    return { 
        colors :    arrayOfSvgColors , 
        contents :  svgContents , 
        path :      logoFile 
    };
};



app.get( '/changecolor/:orig/:targ' , function ( req , res ) {
    const { 
        orig , 
        targ } =        req.params;
    let gotLogo =       getLogoFile( );
    let svgContents =   gotLogo.contents;
    // let svgColors =  gotLogo.colors;
    let svgFile =       gotLogo.path;
    console.log( 'REPLACING ' + orig + ' with ' + targ );
    const newSvgContents = svgContents.replace( new RegExp( orig ) , targ );
    fs.writeFileSync( svgFile , newSvgContents );
    res.send( req.params )
} )


app.get( '/firststep' , function ( req , res ) {
    console.log( 'HEHEHEHEHHEEHEH' )
    let gotLogo =       getLogoFile( );
    let svgContents =   gotLogo.contents;
    let svgColors =     gotLogo.colors;
    res.send( JSON.stringify( svgColors ) );
} );




app.get( '/deletepath/:path' , function ( req , res ) {
    console.log( 'HEHEHEHEHHEEHEH' )
    let gotLogo =       getLogoFile( );
    let svgContents =   gotLogo.contents;
    let svgFile =       gotLogo.path;
    let newSvgConts =   svgContents.replace( new RegExp( req.params.path ) , '' );
    let latestUploadId = new RegExp( getCurrentIds( ) );
    let latestUpload = fs.readdirSync( storage ).filter( f => ( latestUploadId.test( f ) ) );
    console.log( latestUpload )

    fs.writeFileSync( svgFile , newSvgConts );
    let svgColors =     gotLogo.colors;
    res.send( JSON.stringify( svgColors ) );
} );



const upload = multer( { dest : '/imageStorage' } );

app.post( '/upload',    upload.single( 'file' ) , ( req , res ) => {
    const tempPath =    req.file.path;
    const targetPath =  path.join( __dirname , './imageStorage/(' + ( parseInt( getCurrentIds( ) ) + 1 ) + ')' + req.file.originalname );
    console.log( targetPath );
    fs.rename( tempPath , targetPath , err => {
        if ( err ) console.log( err );
        let svgContentsFromUpload = fs.readFileSync( targetPath ).toString( );
        let arrayOfSvgColorsFromUpload = [ ...svgContentsFromUpload.matchAll( 
                /fill\=\"#([A-Za-z0-9]{4,8})\"/g 
            ) ].map( sc => ( sc[ 1 ] ) );
        var yyy = [ ...svgContentsFromUpload.matchAll( /(<path.+?>)/g ) ].map( a => ( a[ 1 ] ) );
        var p = { paths : yyy };
        res.status( 200 )
          .contentType( 'json' )
          .end( JSON.stringify( p ) );
    } )
  }
);





app.listen( port , ( ) => {
  console.log( `Example app listening at http://localhost:${ port }` )
} )










