import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className='login-page'>

            {/* Left Panel — Branding & CTA */}
            <div className='login-left'>
                <div className='login-content'>
                    <Link to='/home' className='login-brand'>
                        &#128218; Love to Read
                    </Link>

                    <h1 className='login-title'>
                        Welcome back,<br />
                        <span className='login-title-accent'>reader.</span>
                    </h1>

                    <p className='login-subtitle'>
                        Sign in to access your shelf, manage loans,
                        and discover your next favourite book.
                    </p>

                    <div className='login-features'>
                        <div className='login-feature'>
                            <span className='login-feature-icon'>&#128218;</span>
                            <span>Tech Books Available</span>
                        </div>
                        <div className='login-feature'>
                            <span className='login-feature-icon'>&#10003;</span>
                            <span>Free for all members</span>
                        </div>
                        <div className='login-feature'>
                            <span className='login-feature-icon'>&#9733;</span>
                            <span>Expert curated selection</span>
                        </div>
                    </div>

                    <button
                        className='btn hero-btn-primary btn-lg login-cta'
                        onClick={() => loginWithRedirect()}
                    >
                        Sign In to Your Account
                    </button>

                    <p className='login-footer-text'>
                        New here?&nbsp;
                        <button
                            className='login-signup-link'
                            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
                        >
                            Create a free account
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Panel — Background Image */}
            <div className='login-right'>
                <div className='login-right-overlay'></div>
                <div className='login-right-content'>
                    <blockquote className='login-quote'>
                        "A reader lives a thousand lives before he dies."
                        <cite>— George R.R. Martin</cite>
                    </blockquote>
                </div>
            </div>

        </div>
    );
};
