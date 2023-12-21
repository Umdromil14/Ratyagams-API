const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ratyagames API', // Title (required)
            version: '1.0.0', // Version (required)
        },
    },
    // Path to the API docs
    apis: [
        './src/v1/controller/*',
        './src/v1/middleware/*',
        './src/v1/model/*',
        './src/v1/route/*',
    ],
}

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync('./src/v1/swagger/spec.json', JSON.stringify(swaggerSpec));