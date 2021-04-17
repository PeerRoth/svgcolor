const express =         require( 'express' );
const cors =            require( 'cors' );
const fs =              require( 'fs' );
const path =            require( 'path' );
const multer =          require( 'multer' );
const port =            3001;
const app =             express( );

app.use( cors( ) );

function getCurrentIds( ) {
    const storage =     path.join( __dirname , 'imageStorage' );
    var idsAlready =  fs.readdirSync( storage )
                            .filter( f => ( /\(/.test( f ) && /\)/.test( f ) ) )
                            .map( m => ( m.match( /\(([0-9]{0,9})\)/ )[ 1 ] ) )
                            .sort( ( a , b ) => ( b - a ) );

    // var idsAlready =    [ ...filesAlready.matchAll( /\(([0-9]{1,9})\)/g ) ]
    //                         .map( m => ( m[ 1 ] ) )
    //                         .sort( ( a , b ) => ( b - a ) );
    return idsAlready[ 0 ];
};

console.log( getCurrentIds( ) )
const dirdirname =      path.dirname( __dirname );
console.log( dirdirname )
const logoFile =        path.join( dirdirname , 'src' , 'logo.svg' );
console.log(logoFile)
const svgContents =     fs.readFileSync( logoFile ).toString( );
var arrayOfSvgColors =  [ ...svgContents.matchAll( 
                                /fill\=\"#([A-Za-z0-9]{4,8})\"/g 
                            ) ].map( sc => ( sc[ 1 ] ) );
                            console.log(arrayOfSvgColors)

console.log( arrayOfSvgColors );

app.get( '/' , ( req , res ) => {
  res.send( 'Hello from ' + 'World!' )
} )

const upload = multer( { dest : '/imageStorage' } );

app.post( '/upload',    upload.single( 'file' ) , ( req , res ) => {
    const tempPath =    req.file.path;
    const targetPath =  path.join( __dirname , './imageStorage/(' + ( parseInt( getCurrentIds ) + 1 ) + req.file.originalname );
    console.log( targetPath );
    fs.rename( tempPath , targetPath , err => {
        if ( err ) console.log( err );
        let svgContentsFromUpload = fs.readFileSync( targetPath ).toString( );
        let arrayOfSvgColorsFromUpload = [ ...svgContentsFromUpload.matchAll( 
                /fill\=\"#([A-Za-z0-9]{4,8})\"/g 
            ) ].map( sc => ( sc[ 1 ] ) );
        // console.log( arrayOfSvgColorsFromUpload )
        var yyy = [ ...svgContentsFromUpload.matchAll( /(<path.+?>)/g ) ].map( a => ( a[ 1 ] ) );
        // console.log( yyy );
        var p = { paths : yyy };
        res.status( 200 )
          .contentType( 'json' )
          .end( JSON.stringify( p ) );
    } )
  }
);



app.get( '/deletepath/:pathNo' , function ( req , res ) {
    console.log( req )
    console.log( req.params )
    const newSvgContents =  svgContents.replace( 
        new RegExp( arrayOfSvgColors[ 0 ] ) , 
        req.params.colorId )
    fs.writeFileSync( logoFile , newSvgContents )
    res.send( req.params )
} )





app.get( '/colors/:colorId' , function ( req , res ) {
    console.log( req )
    console.log( req.params )
    const newSvgContents =  svgContents.replace( 
        new RegExp( arrayOfSvgColors[ 0 ] ) , 
        req.params.colorId )
    fs.writeFileSync( logoFile , newSvgContents )
    res.send( req.params )
} )


app.listen( port , ( ) => {
  console.log( `Example app listening at http://localhost:${ port }` )
} )










