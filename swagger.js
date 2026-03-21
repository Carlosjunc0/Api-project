const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Mainds API',
        description: 'API for managing quotes and forms'
    },
    host: 'localhost:8080',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js', './views/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);