import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export const Heros = () => {

    const { isAuthenticated } = useAuth0();
    return (
        <div className='heros-section'>

            {/* Desktop */}
            <div className='d-none d-lg-block'>
                <div className='row g-0'>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-left'></div>
                    </div>
                    <div className='col-6 col-md-6 d-flex align-items-center'>
                        <div className='heros-text-block'>
                            <div className='section-label'>Our Community</div>
                            <h1>What have you been reading?</h1>
                            <p className='lead'>
                                The library team would love to know what you have been reading.
                                Whether it is to learn a new skill or grow within one,
                                we will be able to provide the top content for you!
                            </p>
                            {isAuthenticated ?
                                <Link className='btn hero-btn-primary btn-lg' to='search'>
                                    Explore Top Books
                                </Link>
                                :
                                <Link className='btn hero-btn-primary btn-lg' to='/login'>
                                    Join for Free
                                </Link>
                            }
                        </div>
                    </div>
                </div>

                <div className='row g-0'>
                    <div className='col-6 col-md-6 d-flex align-items-center'>
                        <div className='heros-text-block heros-text-block-right'>
                            <div className='section-label'>Always Fresh</div>
                            <h1>Our collection is always changing!</h1>
                            <p className='lead'>
                                Try to check in daily as our collection is always changing!
                                We work nonstop to provide the most accurate book selection possible
                                for our members. We are diligent about our book selection and
                                quality is always our top priority.
                            </p>
                        </div>
                    </div>
                    <div className='col-sm-6 col-md-6'>
                        <div className='col-image-right'></div>
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none'>
                <div className='container'>
                    <div className='my-4'>
                        <div className='col-image-left'></div>
                        <div className='heros-text-block mt-0 ms-0' style={{ borderLeft: 'none', paddingLeft: '0' }}>
                            <div className='section-label mt-3'>Our Community</div>
                            <h1>What have you been reading?</h1>
                            <p className='lead'>
                                The library team would love to know what you have been reading.
                                Whether it is to learn a new skill or grow within one,
                                we will be able to provide the top content for you!
                            </p>
                            {isAuthenticated ?
                                <Link className='btn hero-btn-primary btn-lg' to='search'>
                                    Explore Top Books
                                </Link>
                                :
                                <Link className='btn hero-btn-primary btn-lg' to='/login'>
                                    Join for Free
                                </Link>
                            }
                        </div>
                    </div>
                    <div className='my-4'>
                        <div className='col-image-right'></div>
                        <div className='heros-text-block mt-0 ms-0' style={{ borderLeft: 'none', paddingLeft: '0' }}>
                            <div className='section-label mt-3'>Always Fresh</div>
                            <h1>Our collection is always changing!</h1>
                            <p className='lead'>
                                Try to check in daily as our collection is always changing!
                                We work nonstop to provide the most accurate book selection possible
                                for our members.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
