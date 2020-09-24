var express = require('express');
var mysql = require('mysql');

// Create database connection
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'world',
	multipleStatements: true
});

// Connect to database
conn.connect((err) =>{
	if(err) throw err;
	console.log('Mysql Connected...');
});

module.exports = conn;