const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Mainds API',
        description: 'API for managing quotes and forms'
    },
    host: 'api-project-5ndc.onrender.com',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';

const endpointsFiles = [
    './server.js',
    './views/index.js',
    './views/contacts.js',
    './views/quotes.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);