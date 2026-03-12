import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useAuth0 } from "@auth0/auth0-react";

export const ChangeQuantityOfBook: React.FC<{ book: BookModel, deleteBook: any }> =
    (props) => {

        const { getAccessTokenSilently } = useAuth0();
        const [quantity, setQuantity] = useState<number>(0);
        const [remaining, setRemaining] = useState<number>(0);
        const [showConfirm, setShowConfirm] = useState(false);

        useEffect(() => {
            const fetchBookInState = () => {
                props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
                props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
            };
            fetchBookInState();
        }, []);

        async function increaseQuantity() {
            const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;
            const accessToken = await getAccessTokenSilently();
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const quantityUpdateResponse = await fetch(url, requestOptions);
            if (!quantityUpdateResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setQuantity(quantity + 1);
            setRemaining(remaining + 1);
        }

        async function decreaseQuantity() {
            const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;
            const accessToken = await getAccessTokenSilently();
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const quantityUpdateResponse = await fetch(url, requestOptions);
            if (!quantityUpdateResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setQuantity(quantity - 1);
            setRemaining(remaining - 1);
        }

        async function deleteBook() {
            const url = `${process.env.REACT_APP_API}/admin/secure/delete/book?bookId=${props.book?.id}`;
            const accessToken = await getAccessTokenSilently();
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const updateResponse = await fetch(url, requestOptions);
            if (!updateResponse.ok) {
                throw new Error('Something went wrong!');
            }
            props.deleteBook();
        }

        return (
            <div className='admin-book-card'>
                <div className='row g-0 align-items-center'>
                    <div className='col-auto'>
                        <div className='d-none d-lg-block'>
                            {props.book.img ?
                                <img src={props.book.img} width='100' height='160' alt='Book' />
                                :
                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='100' height='160' alt='Book' />
                            }
                        </div>
                        <div className='d-lg-none d-flex justify-content-center'>
                            {props.book.img ?
                                <img src={props.book.img} width='100' height='160' alt='Book' />
                                :
                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                    width='100' height='160' alt='Book' />
                            }
                        </div>
                    </div>

                    <div className='col px-4'>
                        <p className='search-book-author'>{props.book.author}</p>
                        <h5 className='search-book-title'>{props.book.title}</h5>
                        <p className='search-book-desc'>{props.book.description}</p>
                    </div>

                    <div className='col-auto'>
                        <div className='admin-qty-panel'>
                            <div className='admin-qty-stats'>
                                <div className='admin-qty-stat'>
                                    <span className='admin-qty-number'>{quantity}</span>
                                    <span className='admin-qty-label'>Total</span>
                                </div>
                                <div className='admin-qty-divider'></div>
                                <div className='admin-qty-stat'>
                                    <span className='admin-qty-number'>{remaining}</span>
                                    <span className='admin-qty-label'>Available</span>
                                </div>
                            </div>
                            <div className='admin-qty-actions'>
                                <button className='btn admin-btn-add' onClick={increaseQuantity}>
                                    + Add
                                </button>
                                <button className='btn admin-btn-decrease' onClick={decreaseQuantity}>
                                    − Remove
                                </button>
                                <button className='btn admin-btn-delete' onClick={() => setShowConfirm(true)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {showConfirm && (
                <div className='modal fade show d-block' style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>Delete Book</h5>
                                <button type='button' className='btn-close' onClick={() => setShowConfirm(false)}></button>
                            </div>
                            <div className='modal-body'>
                                <p>Are you sure you want to delete <strong>"{props.book.title}"</strong>?</p>
                                <p className='text-danger mb-0'>This action cannot be undone.</p>
                            </div>
                            <div className='modal-footer'>
                                <button className='btn btn-secondary' onClick={() => setShowConfirm(false)}>Cancel</button>
                                <button className='btn btn-danger' onClick={() => { setShowConfirm(false); deleteBook(); }}>Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        );
    }
