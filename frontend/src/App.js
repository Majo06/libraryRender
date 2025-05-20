import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://libraryrender-kx7f.onrender.com'; // Valor por defecto


function App() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        publishedYear: '',
        available: true
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/books`);
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            console.error('Error fetching books:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const addBook = async () => {
        try {
            const response = await fetch(`${API_URL}/api/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook)
            });
            if (response.ok) {
                fetchBooks();
                setNewBook({ title: '', author: '', isbn: '', publishedYear: '', available: true });
            }
        } catch (err) {
            console.error('Error adding book:', err);
        }
    };

const toggleAvailability = async (isbn, available) => {
  if (!isbn) {
    alert('No ISBN provided');
    return;
  }

  try {
    const exists = await checkBookExists(isbn);
    if (!exists) {
      alert('Book not found!');
      return;
    }

    const response = await fetch(`${API_URL}/api/books/${isbn}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !available })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update book');
    }

    fetchBooks(); // Refresh the book list
  } catch (err) {
    console.error('Error updating book:', err);
    alert(`Error: ${err.message}`);
  }
};

const deleteBook = async (isbn) => {
  if (!isbn) {
    alert('No ISBN provided');
    return;
  }

  try {
    const exists = await checkBookExists(isbn);
    if (!exists) {
      alert('Book not found!');
      return;
    }

    const response = await fetch(`${API_URL}/api/books/${isbn}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete book');
    }

    fetchBooks(); // Refresh the book list
    alert('Book deleted successfully!');
  } catch (err) {
    console.error('Error deleting book:', err);
    alert(`Error: ${err.message}`);
  }
};

// Añade esta función junto con tus otras funciones
const checkBookExists = async (isbn) => {
  try {
    const response = await fetch(`${API_URL}/api/books/${isbn}`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data !== null;
  } catch (err) {
    console.error('Error checking book existence:', err);
    return false;
  }
};
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Library Management</h1>

            <div className="mb-6 p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="isbn"
                        placeholder="ISBN"
                        value={newBook.isbn}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="publishedYear"
                        placeholder="Published Year"
                        value={newBook.publishedYear}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                    />
                </div>
                <button
                    onClick={addBook}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Añadir libro
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Book List</h2>
                {books.length === 0 ? (
                    <p>No books available.</p>
                ) : (
                    <div className="grid gap-4">
                        {books.map(book => (
                            <div key={book.isbn} className="p-4 border rounded shadow flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">{book.title}</h3>
                                    <p>Author: {book.author}</p>
                                    <p>ISBN: {book.isbn}</p>
                                    <p>Published: {book.publishedYear}</p>
                                    <p>Available: {book.available ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => toggleAvailability(book.isbn, book.available)}
                                        className={`px-3 py-1 rounded text-white ${book.available ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                                    >
                                        {book.available ? 'Mark Unavailable' : 'Mark Available'}
                                    </button>
                                    <button
                                        onClick={() => deleteBook(book.isbn)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;