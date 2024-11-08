const books = require('./books.js');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
	let finished = (pageCount === readPage);

  	if (!name || name == '') {
	    const response = {
	      status: 'fail',
	      message: 'Gagal menambahkan buku. Mohon isi nama buku',
	    };

	    return h.response(response).code(400);
  	}

  	if (readPage > pageCount) {
  		const response = {
	      status: 'fail',
	      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
	    };

	    return h.response(response).code(400);
  	}

    const newBook = {
   		id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  	};
 
    books.push(newBook);

  	const response = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    };

    return h.response(response).code(201);
};

const readAllBooksHandler = (request, h) => {
	const { reading, finished, name } = request.query;
	let filteredBooks;

	const responseFilteredBooks = (status, code, callback) => {
		return h.response({
			status: status,
			data: {
				books: callback.map(book => ({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				})),
			},
		}).code(code);
	};

	if (reading === '1') {
		filteredBooks = books.filter(book => book.reading === true);
		return responseFilteredBooks('success', 200, filteredBooks);

	} else if (reading === '0') {
		filteredBooks = books.filter(book => book.reading === false);
		return responseFilteredBooks('success', 200, filteredBooks);

	} else if (finished === '1') {
		filteredBooks = books.filter(book => book.finished === true);
		return responseFilteredBooks('success', 200, filteredBooks);

	} else if (finished === '0') {
		filteredBooks = books.filter(book => book.finished === false);
		return responseFilteredBooks('success', 200, filteredBooks);

	} else if (name) {
		filteredBooks = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));

		if (filteredBooks.length === 0) {
			return h.response({
				status: 'fail',
				message: 'Buku tidak ditemukan',
			}).code(404);
		}

		return responseFilteredBooks('success', 200, filteredBooks);
	}

	if(books.length === 0) {
		const response = {
			status: 'success',
			data: {
				books: [],
			}
		};
		return h.response(response).code(200);
	}

	const response = {
		status: 'success',
		data: {
			books: books.map(book => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher
			})),
		},
	};
	
	return h.response(response).code(200);
};

const readBooksByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const book = books.filter((book) => book.id === bookId)[0];

  if (!book) {
  	const response = {
	    status: 'fail',
	    message: 'Buku tidak ditemukan',
	  };

	  return h.response(response).code(404);	
  }

  const response = {
  	status: 'success',
    data: {
      book,
    },
  }
 	
 	return h.response(response).code(200);
}

const updateBooksByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex(book => book.id === bookId);

  if (!name) {
  	const response = {
  		status: 'fail',
  		message: 'Gagal memperbarui buku. Mohon isi nama buku',
  	};

  	return h.response(response).code(400);
  }

  if (readPage > pageCount) {
  	const response = {
  		status: 'fail',
  		message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
  	};

  	return h.response(response).code(400);
  }

  if (index === -1) {
   	const response = h.response({
	    status: 'fail',
	    message: 'Gagal memperbarui buku. Id tidak ditemukan',
	  });
	  response.code(404);
	  return response; 
  }

  books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };
 
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex(book => book.id === bookId);
	if (index === -1) {
		const response = {
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		};

		return h.response(response).code(404);
	}

	books.splice(index, 1);
  const response = {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };

    return h.response(response).code(200);
};


module.exports = {
 addBookHandler,
 readAllBooksHandler,
 readBooksByIdHandler,
 updateBooksByIdHandler,
 deleteBookByIdHandler
};