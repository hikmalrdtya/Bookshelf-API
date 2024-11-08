const {
	addBookHandler,
	readAllBooksHandler, 
	readBooksByIdHandler,
	updateBooksByIdHandler,
	deleteBookByIdHandler
} = require('./handler.js');

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBookHandler,
	},
	{
		method: 'GET',
		path: '/books',
		handler: readAllBooksHandler,
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: readBooksByIdHandler,
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: updateBooksByIdHandler,
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: deleteBookByIdHandler,
	}
];

module.exports = routes;