import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { LoansModal } from './LoansModal';
import { useAuth0 } from '@auth0/auth0-react';

export const Loans = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState(null);
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const shelfCurrentLoansResponse = await fetch(url, requestOptions);
                if (!shelfCurrentLoansResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const shelfCurrentLoansResponseJson = await shelfCurrentLoansResponse.json();
                setShelfCurrentLoans(shelfCurrentLoansResponseJson);
            }
            setIsLoadingUserLoans(false);
        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [isAuthenticated, getAccessTokenSilently, checkout]);

    if (isLoadingUserLoans) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function returnBook(bookId: number) {
        const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(!checkout);
    }

    async function renewLoan(bookId: number) {
        const url = `${process.env.REACT_APP_API}/books/secure/renew/loan?bookId=${bookId}`;
        const accessToken = await getAccessTokenSilently();
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setCheckout(!checkout);
    }

    return (
        <div className='mt-4'>
            {shelfCurrentLoans.length > 0 ?
                <>
                    <h5 className='loans-header'>
                        {shelfCurrentLoans.length} Active Loan{shelfCurrentLoans.length !== 1 ? 's' : ''}
                    </h5>

                    {/* Desktop */}
                    <div className='d-none d-lg-block'>
                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className='loan-item'>
                                    <div className='loan-book-img'>
                                        {shelfCurrentLoan.book?.img ?
                                            <img src={shelfCurrentLoan.book?.img} width='160' height='240' alt='Book' />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                width='160' height='240' alt='Book' />
                                        }
                                    </div>
                                    <div className='loan-options-panel'>
                                        <h4 className='loan-options-title'>Loan Options</h4>
                                        {shelfCurrentLoan.daysLeft > 0 &&
                                            <span className='loan-days-info loan-days-ok'>
                                                Due in {shelfCurrentLoan.daysLeft} days
                                            </span>
                                        }
                                        {shelfCurrentLoan.daysLeft === 0 &&
                                            <span className='loan-days-info loan-days-today'>
                                                Due Today
                                            </span>
                                        }
                                        {shelfCurrentLoan.daysLeft < 0 &&
                                            <span className='loan-days-info loan-days-late'>
                                                Overdue by {Math.abs(shelfCurrentLoan.daysLeft)} days
                                            </span>
                                        }
                                        <div className='list-group mt-3'>
                                            <button
                                                className='list-group-item list-group-item-action'
                                                aria-current='true'
                                                data-bs-toggle='modal'
                                                data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                                            >
                                                Manage Loan
                                            </button>
                                            <Link to='search' className='list-group-item list-group-item-action'>
                                                Search more books
                                            </Link>
                                        </div>
                                        <div className='loan-review-section'>
                                            <p>Help others find their next read — leave a review.</p>
                                            <Link className='btn hero-btn-primary btn-sm'
                                                to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                                Leave a Review
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={false}
                                    returnBook={returnBook} renewLoan={renewLoan} />
                            </div>
                        ))}
                    </div>

                    {/* Mobile */}
                    <div className='d-lg-none'>
                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className='d-flex justify-content-center mb-3'>
                                    {shelfCurrentLoan.book?.img ?
                                        <img src={shelfCurrentLoan.book?.img} width='160' height='240' alt='Book'
                                            style={{ borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }} />
                                        :
                                        <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                            width='160' height='240' alt='Book'
                                            style={{ borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }} />
                                    }
                                </div>
                                <div className='loan-options-panel mb-3'>
                                    <h4 className='loan-options-title'>Loan Options</h4>
                                    {shelfCurrentLoan.daysLeft > 0 &&
                                        <span className='loan-days-info loan-days-ok'>
                                            Due in {shelfCurrentLoan.daysLeft} days
                                        </span>
                                    }
                                    {shelfCurrentLoan.daysLeft === 0 &&
                                        <span className='loan-days-info loan-days-today'>Due Today</span>
                                    }
                                    {shelfCurrentLoan.daysLeft < 0 &&
                                        <span className='loan-days-info loan-days-late'>
                                            Overdue by {Math.abs(shelfCurrentLoan.daysLeft)} days
                                        </span>
                                    }
                                    <div className='list-group mt-3'>
                                        <button
                                            className='list-group-item list-group-item-action'
                                            aria-current='true'
                                            data-bs-toggle='modal'
                                            data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                                        >
                                            Manage Loan
                                        </button>
                                        <Link to='search' className='list-group-item list-group-item-action'>
                                            Search more books
                                        </Link>
                                    </div>
                                    <div className='loan-review-section'>
                                        <p>Help others find their next read — leave a review.</p>
                                        <Link className='btn hero-btn-primary btn-sm'
                                            to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                            Leave a Review
                                        </Link>
                                    </div>
                                </div>
                                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={true}
                                    returnBook={returnBook} renewLoan={renewLoan} />
                            </div>
                        ))}
                    </div>
                </>
                :
                <div className='empty-shelf'>
                    <h3>No active loans</h3>
                    <p className='text-muted mb-4'>You have no books checked out right now.</p>
                    <Link className='btn hero-btn-primary btn-lg' to='search'>
                        Browse Books
                    </Link>
                </div>
            }
        </div>
    );
}
