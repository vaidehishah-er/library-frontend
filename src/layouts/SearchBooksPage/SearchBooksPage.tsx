import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { Pagination } from '../Utils/Pagination';
import { SkeletonSearchPage } from '../Utils/SkeletonBookCard';
import { SearchBook } from './components/SearchBook';

export const SearchBooksPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books`;

            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <div>
                <div className='page-banner'>
                    <div className='container'>
                        <div className='section-label'>Library</div>
                        <h1 className='page-banner-title'>Search Books</h1>
                    </div>
                </div>
                <div className='search-wrapper'><div className='container'><SkeletonSearchPage /></div></div>
            </div>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
        setCategorySelection('Book category')
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (value === 'All') {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        } else {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            {/* Page Banner */}
            <div className='page-banner'>
                <div className='container'>
                    <div className='section-label'>Library</div>
                    <h1 className='page-banner-title'>Search Books</h1>
                    <p className='page-banner-subtitle'>
                        Explore thousands of titles across all categories
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className='search-wrapper'>
                <div className='container'>
                    <div className='search-form-card'>
                        <div className='row g-3 align-items-center'>
                            <div className='col-lg-7'>
                                <div className='d-flex gap-2'>
                                    <input
                                        className='form-control'
                                        type='search'
                                        placeholder='Search by title...'
                                        aria-label='Search'
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                    <button
                                        className='btn hero-btn-primary px-4'
                                        onClick={() => searchHandleChange()}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className='col-lg-5'>
                                <div className='dropdown'>
                                    <button
                                        className='btn btn-secondary dropdown-toggle w-100'
                                        type='button'
                                        id='dropdownMenuButton1'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        {categorySelection}
                                    </button>
                                    <ul className='dropdown-menu w-100' aria-labelledby='dropdownMenuButton1'>
                                        <li onClick={() => categoryField('All')}>
                                            <a className='dropdown-item' href='#'>All</a>
                                        </li>
                                        <li onClick={() => categoryField('FE')}>
                                            <a className='dropdown-item' href='#'>Front End</a>
                                        </li>
                                        <li onClick={() => categoryField('BE')}>
                                            <a className='dropdown-item' href='#'>Back End</a>
                                        </li>
                                        <li onClick={() => categoryField('Data')}>
                                            <a className='dropdown-item' href='#'>Data</a>
                                        </li>
                                        <li onClick={() => categoryField('DevOps')}>
                                            <a className='dropdown-item' href='#'>DevOps</a>
                                        </li>
                                        <li onClick={() => categoryField('Fiction')}>
                                            <a className='dropdown-item' href='#'>Fiction</a>
                                        </li>
                                        <li onClick={() => categoryField('Science')}>
                                            <a className='dropdown-item' href='#'>Science</a>
                                        </li>
                                        <li onClick={() => categoryField('History')}>
                                            <a className='dropdown-item' href='#'>History</a>
                                        </li>
                                        <li onClick={() => categoryField('Biography')}>
                                            <a className='dropdown-item' href='#'>Biography</a>
                                        </li>
                                        <li onClick={() => categoryField('Biology')}>
                                            <a className='dropdown-item' href='#'>Biology</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className='search-results-meta'>
                                <h5>{totalAmountOfBooks} Results Found</h5>
                                <p>Showing {indexOfFirstBook + 1}–{lastItem} of {totalAmountOfBooks} items</p>
                            </div>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                        :
                        <div className='empty-results'>
                            <h3>No books found</h3>
                            <p className='text-muted mb-4'>
                                Try a different search term or browse by category.
                            </p>
                            <a className='btn hero-btn-primary btn-lg' href='#'
                                onClick={e => { e.preventDefault(); setSearchUrl(''); }}>
                                Clear Search
                            </a>
                        </div>
                    }

                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}
