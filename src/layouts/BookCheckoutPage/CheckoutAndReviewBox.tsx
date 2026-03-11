import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean, 
    currentLoansCount: number, isAuthenticated: any, isCheckedOut: boolean, 
    checkoutBook: any, isReviewLeft: boolean, submitReview: any }> = (props) => {

    function buttonRender() {
        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoansCount < 5) {
                return (<button onClick={() => props.checkoutBook()} className='btn hero-btn-primary btn-lg w-100'>Checkout</button>)
            } else if (props.isCheckedOut) {
                return (<p><b>Book checked out. Enjoy!</b></p>)
            } else if (!props.isCheckedOut) {
                return (<p className='text-danger'>Too many books checked out.</p>)
            }
        }
        return (<Link to={'/login'} className='btn hero-btn-primary btn-lg w-100'>Sign In to Checkout</Link>)
    }

    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {
            return(
            <p>
                <LeaveAReview submitReview={props.submitReview}/>
            </p>
            )
        } else if (props.isAuthenticated && props.isReviewLeft) {
            return(
            <p>
                <b>Thank you for your review!</b>
            </p>
            )
        }
        return (
        <div>
            <hr/>
            <p>Sign in to be able to leave a review.</p>
        </div>
        )
    }

    return (
        <div className={props.mobile ? 'checkout-info-box mt-4' : 'checkout-info-box col-3'}>
            <p className='checkout-loans-bar'>
                <strong>{props.currentLoansCount}/5</strong> books checked out
            </p>
            <hr className='checkout-divider' style={{margin: '0.75rem 0 1rem'}} />
            <div className={`checkout-availability ${props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ? 'available' : 'waitlist'}`}>
                {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ? 'Available' : 'Wait List'}
            </div>
            <div className='checkout-stats'>
                <div className='checkout-stat'>
                    <span className='checkout-stat-value'>{props.book?.copies}</span>
                    <span className='checkout-stat-label'>Total Copies</span>
                </div>
                <div className='checkout-stat'>
                    <span className='checkout-stat-value'>{props.book?.copiesAvailable}</span>
                    <span className='checkout-stat-label'>Available</span>
                </div>
            </div>
            {buttonRender()}
            <p className='checkout-note'>Availability may change until checkout is complete.</p>
            <hr className='checkout-divider' style={{margin: '1rem 0'}} />
            {reviewRender()}
        </div>
    );
}