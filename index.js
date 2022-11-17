const server = require('./src/api/server');
const logger = require('./src/common/lib/winston/logger');

server.start().catch((err) => {
	logger.log({
		level: 'error',
		message: err.message,
	});

	process.exit();
});
