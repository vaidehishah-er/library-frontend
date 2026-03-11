import ReviewModel from "../../models/ReviewModel";
import { StarsReview } from "./StarsReview";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {
    
    const date = new Date(props.review.date);

    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;
    
    return (
        <div className='review-card'>
            <div className='d-flex justify-content-between align-items-start mb-1'>
                <span className='review-email'>{props.review.userEmail}</span>
                <StarsReview rating={props.review.rating} size={15} />
            </div>
            <span className='review-date'>{dateRender}</span>
            {props.review.reviewDescription &&
                <p className='review-body'>{props.review.reviewDescription}</p>
            }
        </div>
    );
}