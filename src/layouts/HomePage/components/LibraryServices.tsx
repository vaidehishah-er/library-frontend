import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export const LibraryServices = () => {

    const { isAuthenticated } = useAuth0();

    return (
        <div className='services-section'>
            <div className='container'>
                <div className='services-inner'>
                    <div className='services-text'>
                        <div className='section-label'>Personal Support</div>
                        <h2 className='services-title'>
                            Can't find what<br />you're looking for?
                        </h2>
                        <p className='services-desc'>
                            If you cannot find what you are looking for,
                            send our library admins a personal message.
                            We respond within 24 hours and always find a solution.
                        </p>
                        <div className='services-features'>
                            <div className='services-feature'>
                                <span className='services-feature-icon'>&#10003;</span>
                                <span>Personalized recommendations</span>
                            </div>
                            <div className='services-feature'>
                                <span className='services-feature-icon'>&#10003;</span>
                                <span>Direct admin messaging</span>
                            </div>
                            <div className='services-feature'>
                                <span className='services-feature-icon'>&#10003;</span>
                                <span>24-hour response guarantee</span>
                            </div>
                        </div>
                        {isAuthenticated ?
                            <Link to='/messages' className='btn hero-btn-primary btn-lg mt-3'>
                                Contact Library Services
                            </Link>
                            :
                            <Link to='/login' className='btn hero-btn-primary btn-lg mt-3'>
                                Sign Up — It's Free
                            </Link>
                        }
                    </div>
                    <div className='services-image lost-image'></div>
                </div>
            </div>
        </div>
    );
}
