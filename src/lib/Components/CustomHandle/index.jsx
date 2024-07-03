import { Handle, Position } from 'reactflow';

const HandleWithValidation = ({ id, type, position, source }) => {
  let margin = '0px'
  if(position === Position.Left || position === Position.Right){
    margin = '-10px -7px'
  } else if(position === Position.Top || position === Position.Bottom){
    margin = '-8px 0px'
  }

  const customStyle = {
    background: '#fff',
    border: '1px solid #c1c1c3',
    width: '20px',
    height: '20px',
    padding: '5px',
    margin: margin,
    zIndex: 5, 
  };

	return (
		<Handle
      id={id}
			type={type}
			position={position}
			onConnect={(params) => console.log('handle onConnect', params)}
			style={{...customStyle}}
		/>
	);
};

export default HandleWithValidation;
