import React , { useState } from 'react'
import { 
    CirclePicker ,
    SwatchesPicker
 } from 'react-color'
import { pmsColors } from './pmscolors.jsx';




export default function ColorPacker( props ) {

    const { indy , colors , color0 , handleColorPick } = props;

    const [ colorLocal , setColorLocal ] = useState( color0 );


    function handleChangeComplete( colr ) {
        console.log( colr );
        let clrHax = colr.hex.replace( '#' , '' );
        setColorLocal( clrHax );
        handleColorPick( indy , colr.hex );
    }

    var pcol = pmsColors.map( p => ( p[ 2 ] ) )
    var pcor = pcol.slice( 0 , 200 );
    var arrayOfArrays = [ ];

    [ ...'abcdefghijklmnopqrstuv' ].map( ( a , b ) => {
        console.log( b , ' ' , a );
        let start = b * 6;
        let end = ( b * 6 ) + 6;
        arrayOfArrays.push( pcor.slice( start , end ) );
    } );

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
                    onChangeComplete={ handleChangeComplete } 
                />





            </> )
}