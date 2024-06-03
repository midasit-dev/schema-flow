import React from 'react';
import ReactFlowComp from "./Components/ReactFlowComp";
// import { Icon, Svglist } from './SVGComps/index';
export const Icon = (props) => {
	const { SVG, onClickHandler } = props;

	return (
		<div
      style={{widht:"30px", height:"30px", backgroundColor:"white", cursor:"pointer", position:"absolute", top:"0", left:"0", zIndex:"1000", padding:"10px"}}
			onClick={() => onClickHandler()}
		>
			{SVG}
		</div>
	);
};

export const Svglist = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 5L10 5M21 19L10 19M21 12L10 12M6 5C6 5.82843 5.32843 6.5 4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5ZM6 19C6 19.8284 5.32843 20.5 4.5 20.5C3.67157 20.5 3 19.8284 3 19C3 18.1716 3.67157 17.5 4.5 17.5C5.32843 17.5 6 18.1716 6 19ZM6 12C6 12.8284 5.32843 13.5 4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Svgminimize = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.99988 8H3.19988C4.88004 8 5.72011 8 6.36185 7.67302C6.92634 7.3854 7.38528 6.92646 7.6729 6.36197C7.99988 5.72024 7.99988 4.88016 7.99988 3.2V3M2.99988 16H3.19988C4.88004 16 5.72011 16 6.36185 16.327C6.92634 16.6146 7.38528 17.0735 7.6729 17.638C7.99988 18.2798 7.99988 19.1198 7.99988 20.8V21M15.9999 3V3.2C15.9999 4.88016 15.9999 5.72024 16.3269 6.36197C16.6145 6.92646 17.0734 7.3854 17.6379 7.67302C18.2796 8 19.1197 8 20.7999 8H20.9999M15.9999 21V20.8C15.9999 19.1198 15.9999 18.2798 16.3269 17.638C16.6145 17.0735 17.0734 16.6146 17.6379 16.327C18.2796 16 19.1197 16 20.7999 16H20.9999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const examplePylist = [
  "create-alignment-moaui",
  "baseplate-moaui",
  "concrete-material-set-eurocode-moaui",
  "convert-load-combinations-into-sds-format-moaui",
  "extrude_offset",
  "flared-pier-moaui",
  "group-pile-creator-moaui",
  "inertial-forces-controller-moaui",
  "lcom-generator-moaui",
  "linkprojection-moaui",
  "local_axis-moaui",
  "pile-spring-moaui",
  "response-spectrum-generator-moaui",
  "series-load-moaui",
  "steel-girder-table",
  "temperature-gradient-stress-calculator-moaui",
  "tendon-profile-converter-moaui",
  "texdas"
];

function App() {
  const [openPylist, setOpenPylist] = React.useState(false);

  return (
    <div className="App" style={{width:"100vw", height:"100vh"}}>
      <div>
        {openPylist === false ?
        <Icon SVG={<Svglist />} onClickHandler={() => {setOpenPylist(true)}} />
        :
        <div style={{ width: "auto", height: "auto", backgroundColor: "rgba(252, 249, 235, 0.7)", cursor: "pointer", position: "absolute", top: "20px", left: "20px", zIndex: "1000", padding: "5px", border: "1px solid #c1c1c3", borderRadius: "8px" }}>
          <div
            style={{widht:"12px", height:"12px", backgroundColor:"white", cursor:"pointer", position:"fixed", top:"5px", left:"5px", zIndex:"1000", padding:"10px", borderRadius:"50%", border:"1px solid #c1c1c3", display:"flex", alignItems:"center", justifyContent:"center"}}
            onClick={() => (setOpenPylist(false))}
          >
            <Svgminimize />
          </div>
          {examplePylist.map((py, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "5px", cursor: "pointer", borderBottom: index !== examplePylist.length - 1 ? "1px solid #c1c1c3" : "none" }} onClick={() => { setOpenPylist(false) }}>
              <img style={{ width: "14px", height: "14px", marginRight: "5px", marginTop: "5px" }} src={`${process.env.PUBLIC_URL}/svg/Python.svg`} alt="Python" />{py}
            </div>
          ))}
        </div>
        }
      </div>
      <ReactFlowComp />
    </div>
  );
}

export default App;
