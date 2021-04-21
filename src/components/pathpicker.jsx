import React , { useState } from 'react';
import { Row , Col } from 'react-bootstrap';

export default function PathPicker ( props ) {


    const { paths , genPaths } = props;





function doDat( it ) {
    console.log( it )
}
    return (




        <Col xs={ 3 }>
            <Row>
        { paths.map( p => {
            return (
                <Col
                onClick={ ( ) => doDat( 'dat' ) }
                >
                    <div 
                    id='co0'
                    style={ {
                        width : '28px' , 
                        height: '28px' ,
                        paddingRight : '14px' ,
                        paddingBottom : '14px' ,
                        transform : 'scale(1)' ,
                        backgroundColor : p.fill !== 'none' ? p.fill : 'transparent' ,
                        transition : 'transform 100ms ease 0s' ,
                    } }>
                    <span>
                    <div 
                        title="#001689" 
                        tabindex="0" 
                        id='co00'
                        style={ { 
                            zIndex:999999 ,
                            // backgroundColor : 'transparent' ,
                            height : '100%' ,
                            width : '100%' ,
                            cursor : 'pointer' ,
                            // position : 'relative' ,
                            // backgroundColor : p.fill !== 'none' ? p.fill : 'transparent' ,
                            outline : 'none' ,
                            borderRadius : '50%' ,
                            boxShadow : p.fill !== 'none' ? p.fill + ' 0px 0px 0px 15px inset': 'transparent' + ' 0px 0px 0px 15px inset' ,
                            transition : 'box-shadow 100ms ease 0s'
                        } } >

                    </div>
                    </span>
                    </div>
                    { p.fill }
                            </Col>
                    )
                })}
         
                </Row>
        </Col>
    )
}






