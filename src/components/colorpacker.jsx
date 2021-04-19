import React , { useState } from 'react'
import { 
    BlockPicker ,
    CirclePicker ,
    SwatchesPicker
 } from 'react-color'

export default function ColorPacker( props ) {

    const { indy , setColor0 , color0 , changeOne , handleColorPick } = props;

    const [ colorLocal , setColorLocal ] = useState( color0 );


    function handleChangeComplete( colr ) {
        console.log( colr );
        let clrHax = colr.hex.replace( '#' , '' );
        // changeOne( color0 , clrHax )
        setColorLocal( clrHax );
        handleColorPick( indy , colr.hex );
    }
    
    return ( <>
                <h5>
                    CirclePicker
                </h5>
                <CirclePicker 
                    onChangeComplete={ handleChangeComplete }
                    color={ colorLocal } 
                    />
                <h5>
                BlockPicker
                </h5>
                <BlockPicker 
                    onChangeComplete={ handleChangeComplete } 
                    color={ colorLocal }
                    />
                <h5>
                SwatchesPicker
                </h5>
                <SwatchesPicker 
                    color={ colorLocal } 
                    onChangeComplete={ handleChangeComplete } 
                />
            </> )
}