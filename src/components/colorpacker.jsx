import React from 'react'
import { CirclePicker } from 'react-color'
 

export default function ColorPacker( props ) {
 

    const { setColor0 , color0 , changeOne } = props;

    function handleChangeComplete( colr ) {
        console.log( colr );
        let clrHax = colr.hex.replace( '#' , '' );
        changeOne( color0 , clrHax )
        setColor0( clrHax )
    }

    
    return (

        <CirclePicker 
            color={ color0 }
            onChangeComplete={ handleChangeComplete }
        />
    )




}