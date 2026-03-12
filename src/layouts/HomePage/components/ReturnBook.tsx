import React from 'react'
import { Link } from 'react-router-dom';
import BookModel from '../../../models/BookModel';

interface Props {
    book: BookModel;
    categoryLabel?: string;
    categoryColor?: string;
}

export const ReturnBook: React.FC<Props> = ({ book, categoryLabel, categoryColor }) => {
    const color = categoryColor || 'var(--gold)';

    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='book-card text-center' style={{ position: 'relative' }}>

                {/* Category badge */}
                {categoryLabel && (
                    <div className='book-card-category-badge' style={{ background: color }}>
                        {categoryLabel}
                    </div>
                )}

                {/* Colored top accent bar */}
                <div className='book-card-accent-bar' style={{ background: color }} />

                {/* Cover image */}
                <div className='book-card-cover'>
                    {book.img
                        ? <img src={book.img} width='151' height='233' alt={book.title} />
                        : <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                               width='151' height='233' alt={book.title} />
                    }
                </div>

                <h6 className='book-card-title'>{book.title}</h6>
                <p className='book-card-author'>{book.author}</p>
                <Link className='book-card-btn' to={`checkout/${book.id}`}
                      style={{ borderColor: color, color }}>
                    Reserve
                </Link>
            </div>
        </div>
    );
};
