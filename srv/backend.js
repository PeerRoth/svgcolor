const express =     require( 'express' );
const cors =        require( 'cors' );
const fs =          require( 'fs' );
const path =        require( 'path' );



const app = express( );
app.use( cors( )

)

const dirdirname =      path.dirname( __dirname );
const logoFile =        path.join( dirdirname , 'src' , 'logo.svg' );
const svgContents =     fs.readFileSync( logoFile ).toString( );
var arrayOfSvgColors =  [ ...svgContents.matchAll( /fill\=\"#([A-Za-z0-9]{4,8})\"/g ) ].map( sc => ( sc[ 1 ] ) );
console.log( arrayOfSvgColors )

const port = 3001;

app.get( '/' , ( req , res ) => {
  res.send( 'Hello from ' + 'World!' )
} )


app.get( '/colors/:colorId' , function ( req , res ) {
    // console.log( req )
    // console.log( req.params )
    const newSvgContents =  svgContents.replace( 
        new RegExp( arrayOfSvgColors[ 0 ] ) , 
        req.params.colorId )
    fs.writeFileSync( logoFile , newSvgContents )
    res.send( req.params )
} )


app.listen( port , ( ) => {
  console.log( `Example app listening at http://localhost:${ port }` )
} )










