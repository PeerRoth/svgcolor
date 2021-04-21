import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function PlodingRear(props) {
  const { handleUpload } = props;

  return (
    <>
      <Row 
    //   className='landing' 
      style={ { height : "70px" } }
      >
          <span className='landing' >hi</span> <span className='landingtoo'>there</span>
        <Col>
          <label
            id={ "cloud" }
            htmlFor={ "nid" }
            style={ {
              marginLeft: "auto",
              marginRight: "auto",
              alignContents: "center",
              marginBottom: "10px",
            } }
          >
            <svg
              className="svgcloud"
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 266.51 201.7"
            >
                <path
                  d="M7284.58-7216c0-.84.13-1.68.13-2.52,0-45.52-30.82-82.36-68.84-82.36-27.43,0-51,19.19-62.06,46.92a31.1,31.1,0,0,0-16-4.55c-17.54,0-32.18,15.34-35,35.37-21.06,8.54-36.1,32.28-36.1,60.23,0,35.16,23.85,63.73,53.25,63.73h61v-56h-28.69l47.73-58.62,47.73,58.55H7219v56h65.63c26.89,0,48.6-26.26,48.6-58.41S7311.48-7215.84,7284.58-7216Z"
                  transform="translate(-7066.75 7300.85)"
                />
            </svg>
          </label>
        </Col>
      </Row>

      <input
        name={"nid"}
        id={"nid"}
        type="file"
        accept=".svg"
        className="visually-hidden"
        onChange={handleUpload}
      />
    </>
  );
}
