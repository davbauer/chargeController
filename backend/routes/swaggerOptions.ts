import swaggerJsdoc from 'swagger-jsdoc';
import InterfaceConfig from '../models/InterfaceConfig.js';
import Configfile from '../classes/ConfigFile.js';
import InterfaceLiveData from '../models/InterfaceLiveData.js';
import LiveData from '../classes/LiveData.js';
import InterfaceAppInfo from '../models/InterfaceAppInfo.js'
import AppInfo from '../classes/AppInfo.js'

function getSwaggerSchemaFromTypeScript<T extends object>(sampleObject: T): object {
	const schema: { type: string; properties: Record<string, { type: string }> } = {
		type: 'object',
		properties: {}
	};

	for (const key of Object.keys(sampleObject)) {
		const value = sampleObject[key as keyof T];
		const type = typeof value;
		schema.properties[key] = { type: type };
	}

	return schema;
}

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Express API with Swagger',
			version: '1.0.0',
			description: 'Backend from chargeController\n\nSwagger-JSON: [click here](/api-docs.json)'
		},
		components: {
			schemas: {
				InterfaceConfig: getSwaggerSchemaFromTypeScript<InterfaceConfig>(Configfile.read()),
				InterfaceLiveData: getSwaggerSchemaFromTypeScript<InterfaceLiveData>(LiveData.data),
				InterfaceAppInfo: getSwaggerSchemaFromTypeScript<InterfaceAppInfo>(AppInfo.get())
			}
		}
	},
	// Path to the API docs
	apis: ['./routes/*Routes.ts']
};

const specs = swaggerJsdoc(options);
export default specs;
