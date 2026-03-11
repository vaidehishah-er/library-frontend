import { Link } from "react-router-dom";
import ReviewModel from "../../models/ReviewModel";
import { Review } from "../Utils/Review";

export const LatestReviews: React.FC<{
    reviews: ReviewModel[], bookId: number | undefined, mobile: boolean
}> = (props) => {

    return (
        <div className={props.mobile ? 'mt-4' : 'mt-5'}>
            <div className='latest-reviews-header'>
                <div className='section-label'>Community</div>
                <h3 className='latest-reviews-title'>Reader Reviews</h3>
            </div>
            {props.reviews.length > 0 ?
                <>
                    {props.reviews.slice(0, 3).map(eachReview => (
                        <Review review={eachReview} key={eachReview.id} />
                    ))}
                    <div className='mt-3'>
                        <Link className='carousel-view-all' to={`/reviewlist/${props.bookId}`}>
                            See All Reviews
                        </Link>
                    </div>
                </>
                :
                <div className='empty-shelf' style={{padding: '2rem 0'}}>
                    <h4>No reviews yet</h4>
                    <p className='text-muted'>Be the first to leave a review for this book.</p>
                </div>
            }
        </div>
    );
}