import swaggerJsdoc from 'swagger-jsdoc';
import ConfigInterface from '../models/ConfigInterface.js';
import Configfile from "../classes/ConfigFile.js"
import LiveDataInterface from '../models/LiveDataInterface.js';
import LiveData from '../classes/LiveData.js';

function getSwaggerSchemaFromTypeScript<T extends object>(sampleObject: T): object {
    const schema: any = {
        type: 'object',
        properties: {}
    };

    for (const key of Object.keys(sampleObject)) {
        const type = typeof sampleObject[key];
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
            description: 'Backend from chargeController\n\nSwagger-JSON: [click here](/api-docs.json)',
        },
        components: {
            schemas: {
                ConfigInterface: getSwaggerSchemaFromTypeScript<ConfigInterface>(Configfile.read()),
                LiveDataInterface: getSwaggerSchemaFromTypeScript<LiveDataInterface>(LiveData.data)
            }
        },
    },
    // Path to the API docs
    apis: ['./routes/*Routes.ts'],
};

const specs = swaggerJsdoc(options);
export default specs;


