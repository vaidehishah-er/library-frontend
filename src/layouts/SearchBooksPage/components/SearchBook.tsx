import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel"

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {
    return (
        <div className='search-book-card'>
            <div className='row g-0 align-items-center'>
                <div className='col-auto'>
                    <div className='d-none d-lg-block'>
                        {props.book.img ?
                            <img src={props.book.img} width='100' height='160' alt='Book' />
                            :
                            <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='100' height='160' alt='Book' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='100' height='160' alt='Book' />
                            :
                            <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                                width='100' height='160' alt='Book' />
                        }
                    </div>
                </div>
                <div className='col px-4'>
                    <p className='search-book-author'>{props.book.author}</p>
                    <h5 className='search-book-title'>{props.book.title}</h5>
                    <p className='search-book-desc'>{props.book.description}</p>
                </div>
                <div className='col-auto d-flex justify-content-center'>
                    <Link className='btn hero-btn-primary' to={`/checkout/${props.book.id}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
