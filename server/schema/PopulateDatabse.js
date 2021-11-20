const UserData = [
	{
		username: 'Ahsan'
	}
];

const mysql = require('mysql');

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'moseeqi'
});

db.connect(function(err) {
	if (err) {
		console.error(`Error connecting to database: ${err}`);
		return;
	}

	console.log(`Connected to database as id ${db.threadId}`);
});

// Clean up process
process.on('SIGTERM', () => {
	server.close(() => {
		console.log('Server stopped');
	});
});
