import React from 'react';

async function fetchTemplate() {
	const response = await fetch(`${process.env.REACT_APP_ACTUAL_DV_API_URL}backend/wgsd/templates`);
	const data = await response.json();
	return data;
}

export default function Template({ width, src }) {
	const [templateList, setTemplateList] = React.useState([]);

	React.useEffect(() => {
		async function getTemplateList() {
			const templatelist = await fetchTemplate();
			if (!ignore) {
				setTemplateList(templatelist);
			}
		}

		let ignore = false;
		getTemplateList();
		return () => {
			ignore = true;
		};
	}, []);

	return (
		<>
			{templateList.map((template, index) => {
				let name = '';
				if (index === 0) {
					name = './김.png';
				} else if (index === 1) {
					name = './정.png';
				} else if (index === 2) {
					name =
						'https://midasit-kr-pr-s3-rpm-attachfile.s3.ap-northeast-2.amazonaws.com/rs2/DNxdkF1OERt6WJGJctdwvMNXjIA6lwzO/IyQuLoRYsBif/file/154/revision/1/e4b54d7f-68ce-43b3-b490-4827f8ec293d?response-content-disposition=attachment%3B%20filename%20%3D%22image.png%22&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAIs1lwl91A5Y7OGEr4nQ5NwVUgvGmWfWQfmOk22M3ZGiAiBdoROHmax88XVu8yc3CLh1LQ1Cw0agOECkZkRC63hnZSqNBAjP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDk0MzY5MjUyNDkyNyIMcKNJUsbZyii0FM33KuEDWtLOkIRQl6CUYqRsVInRET2eGZshqtEWx3aVKjLxAIHxqEz2Idv0uQ0WmYA4X6FyDrScuUa3zdzwQjsUUzfWTMby85ghNi6clo5MGswOzNLw3KlUCVJagMhTS%2FNetu4tb88dwPS2jZqzLBEZZkoB2IQfhyW1kIKNcRs8%2Fg62WUE%2BS219u0JMWtCqJ6fc%2BgYXaq7SpWcYzu5ZBhbHCibkVzhqTjeOVwNbsojjCX1Laisqc38MgHwlg0oZf2K3AChyfi3hOpVTBhHV0BEzDq7CXQghXfXXhg2XOXa7mv6XHLGXr6xDaAgBpo807OMguxNx4su8lRtwos%2BAzl3mb%2BUdtMmToAJlKQkvohN5guRculpUIQw2cYsNBYQPr44gyBb6DqrETsZ6lTkbAqRtU9fRroZne%2FC3D4R3zcFuxMcv%2Fsjq9PE7SycEgt5ZEeulStI5tTfbMvhx%2BRHhl3AlsEVp3aAhdSxxTf%2BHdN6FPqqp%2BQ5ROPxuktgMEtgABJ0e7JVPRg%2F9GRQQWksdcX6FFXf7hwguqmIo0HOj4gjOGtx4ZWMP%2BsmUJJ13QEnnUXQXhvWy4OTBhcJkch9pnH0YwUOtae72%2FNVZTeoPlKB0Xn%2Bei1A8uwWfzT8zLOle75xiQaO97DCB4t%2B2BjqlAUFVUa6sGJfSh%2FLEDk9aT2W2Ify2zPiEKmWmUHc29K8hx4EbI2pDc7KXM3vY%2BncqNZM2Ar%2FBXpPqn9dLB9rFzT7xFML0cKPwbvRIrN1UxvaBXLed5114lC0jGYp3R3ltAT%2BlpuIcnzz5DwNZg9L2bYzeRhTm%2FMDoY9yhg3EaZalVE2DjnTt%2FZFa4AcgrCArmLTxjtqtcJwYztGHcirUTgKu4RkgHJQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240904T054327Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=ASIA5XODVFV7UB4YPNDM%2F20240904%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=44f493dd665ef675e11e934614d4c0c4397305a789229731d01bf65e081c0a99';
				} else {
					name = './reactflow.png';
				}
				return (
					<div
						key={template.templateId}
						style={{
							width,
							height: width,
							display: 'flex',
							justifyContent: 'cetner',
							flexDirection: 'column',
							borderRadius: '10px',
							cursor: 'pointer',
						}}
					>
						<div
							style={{
								width,
								height: width,
								borderRadius: '10px',
								border: '1px solid #e6e6e6',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<img src={name} alt='Thumbnail' style={{ width, height: width }} />
						</div>
						<h2>{template.title}</h2>
						<p>{template.updatedAt}</p>
					</div>
				);
			})}
		</>
	);
}
