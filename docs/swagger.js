import swaggerJSDoc from 'swagger-jsdoc'
import fs from 'fs';
import yaml from 'js-yaml';

const parsed = yaml.load(fs.readFileSync('./docs/components.yaml', 'utf8'));
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    components: parsed.components,          
  },
  apis: ['./docs/data/*.js'], 
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec