const outputSchema = {
	outerPolygon: {
		points: [
			{ x: 0, y: 0 },
			{ x: 600, y: 0 },
			{ x: 600, y: 400 },
			{ x: 0, y: 400 },
		],
	},
	innerPolygon: null,
	material: {
		design_code: 'ACI318M-20',
		grade: 'C123',
	},
};

const inputSchema = {
	properties: {
		outerPolygon: {
			allOf: [
				{
					properties: {
						points: {
							items: {
								properties: {
									x: { type: 'number', title: 'X' },
									y: { type: 'number', title: 'Y' },
								},
								type: 'object',
								required: ['x', 'y'],
								title: 'Point',
								description: 'Point class',
							},
							type: 'array',
							title: 'Points',
							description: 'Points',
							default: [
								{ x: 0, y: 0 },
								{ x: 400, y: 0 },
								{ x: 400, y: 600 },
								{ x: 0, y: 600 },
							],
						},
					},
					type: 'object',
					title: 'GSD Points',
					description: 'GSD Points class',
				},
			],
			description: 'Outer polygon of the concrete',
			default: {
				points: [
					{ x: 0, y: 0 },
					{ x: 400, y: 0 },
					{ x: 400, y: 600 },
					{ x: 0, y: 600 },
				],
			},
		},
		innerPolygon: {
			allOf: [
				{
					properties: {
						points: {
							items: {
								properties: {
									x: { type: 'number', title: 'X' },
									y: { type: 'number', title: 'Y' },
								},
								type: 'object',
								required: ['x', 'y'],
								title: 'Point',
								description: 'Point class',
							},
							type: 'array',
							title: 'Points',
							description: 'Points',
							default: [
								{ x: 0, y: 0 },
								{ x: 400, y: 0 },
								{ x: 400, y: 600 },
								{ x: 0, y: 600 },
							],
						},
					},
					type: 'object',
					title: 'GSD Points',
					description: 'GSD Points class',
				},
			],
			description: 'Inner polygon of the concrete',
		},
		material: {
			allOf: [
				{
					properties: {
						design_code: {
							type: 'string',
							title: 'Design Code',
							description: 'Design code',
							default: 'ACI318M-19',
						},
						grade: {
							type: 'string',
							title: 'Grade',
							description: 'Grade of the concrete',
							default: 'C12',
						},
					},
					type: 'object',
					title: 'GSD Concrete Grade',
					description: 'GSD concrete class',
				},
			],
			description: 'Material of the concrete',
			default: {
				design_code: 'ACI318M-19',
				grade: 'C12',
			},
		},
	},
	type: 'object',
	title: 'GSD Concrete Geometry',
	description: 'GSD concrete geometry class',
};
