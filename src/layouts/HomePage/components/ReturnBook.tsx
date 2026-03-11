import React from 'react'
import { Link } from 'react-router-dom';
import BookModel from '../../../models/BookModel';

export const ReturnBook: React.FC<{book: BookModel}> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='book-card text-center'>
                {props.book.img ?
                    <img
                        src={props.book.img}
                        width='151'
                        height='233'
                        alt="book"
                    />
                    :
                    <img
                        src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='151'
                        height='233'
                        alt="book"
                    />
                }
                <h6 className='book-card-title'>{props.book.title}</h6>
                <p className='book-card-author'>{props.book.author}</p>
                <Link className='book-card-btn' to={`checkout/${props.book.id}`}>Reserve</Link>
            </div>
        </div>
    );
}