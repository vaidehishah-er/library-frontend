import { Link } from "react-router-dom";

export const ExploreTopBooks = () => {
    return (
        <div className='hero-section'>
            <div className='hero-overlay'></div>
            <div className='hero-content'>
                <div className='hero-badge'>&#10022; Premium Digital Library</div>
                <h1 className='hero-title'>
                    Discover Your Next
                    <span className='hero-title-accent'>Great Adventure</span>
                </h1>
                <p className='hero-subtitle'>
                    Thousands of titles curated by experts.<br />
                    Read, learn, and grow — all in one place.
                </p>
                <div className='hero-cta'>
                    <Link className='btn hero-btn-primary btn-lg' to='/search'>
                        Explore Books
                    </Link>
                    <Link className='btn hero-btn-secondary btn-lg' to='/search'>
                        Browse Categories
                    </Link>
                </div>
                <div className='hero-stats'>
                    <div className='hero-stat'>
                        <span className='hero-stat-number'>Tech</span>
                        <span className='hero-stat-label'>Books Available</span>
                    </div>
                    <div className='hero-stat-divider'></div>
                    <div className='hero-stat'>
                        <span className='hero-stat-number'>Free</span>
                        <span className='hero-stat-label'>For All Members</span>
                    </div>
                    <div className='hero-stat-divider'></div>
                    <div className='hero-stat'>
                        <span className='hero-stat-number'>Expert</span>
                        <span className='hero-stat-label'>Curated Selection</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
