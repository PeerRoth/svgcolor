import React , { useState } from 'react'
import { 
    BlockPicker ,
    CirclePicker ,
    SwatchesPicker
 } from 'react-color'
import { pmsColors }   from './pmscolors.jsx';


export default function ColorPacker( props ) {


    const { indy , colors , setColor0 , color0 , changeOne , handleColorPick } = props;

    const [ colorLocal , setColorLocal ] = useState( color0 );


    function handleChangeComplete( colr ) {
        console.log( colr );
        let clrHax = colr.hex.replace( '#' , '' );
        setColorLocal( clrHax );
        handleColorPick( indy , colr.hex );
    }

console.log( pmsColors );
var pcol = pmsColors.map( p => ( p[ 2 ] ) )
console.log( pcol );
console.log( pcol.length );
var pcor = pcol.slice( 0 , 200 );

console.log( pcor.length );

var arrayOfArrays = [ ];

[ ...'abcdefghijklmnopqrstuv' ].map( ( a , b ) => {
    console.log( b , ' ' , a );
    let start = b * 6;
    let end = ( b * 6 ) + 6;
    arrayOfArrays.push( pcor.slice( start , end ) );
} );

console.log( arrayOfArrays )

// var tempPms = [ ];


    // const pmscolors = pmsColors.pmsColors
    //     .filter( pms => {
    //         if ( !tempPms.includes( pms[ 2 ] ) ) {
    //             tempPms.push( pms[ 2 ] );
    //             return true;
    //         };
    //         return false;
    //     } )
    //     .map( p => ( p[ 2 ] ) )





    // console.log( pmscolors.length )
    console.log( colors )

    return ( <>

                <h5>
                    CirclePicker
                </h5>
                <CirclePicker 
                    colors={ colors }
                    onChangeComplete={ handleChangeComplete }
                    color={ colorLocal } 
                    />
                <h5>
                SwatchesPicker
                </h5>
                <SwatchesPicker 
                colors={ arrayOfArrays }
                    // colors={ 
                    //     [ 
                    //         pmscolors.slice( 0 , 6 ) , 
                    //         pmscolors.slice( 6 , 12 ) 
                    //     ] } 
                    // presetColors={ tcolors.map( c=> ( c.replace( '#' , '' ) ) ) }
                    onChangeComplete={ handleChangeComplete } 
                />





            </> )
}