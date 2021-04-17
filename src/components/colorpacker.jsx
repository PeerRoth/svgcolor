import React from 'react'
import { CirclePicker } from 'react-color'
 

export default function ColorPacker( props ) {
 

    const { 
        setColor0 , color0 ,
        submitColor 
    } = props;
    // const [ background , setBackground ] = useState( '#fff' );

    function handleChangeComplete( colr ) {
        console.log( colr );
        let clrHax = colr.hex.replace( '#' , '' );
        submitColor( clrHax )
        setColor0( clrHax )
    }

    
    return (

        <CirclePicker 
            color={ color0 }
            onChangeComplete={ handleChangeComplete }
        />
    )




}