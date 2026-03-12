export const SkeletonBookCard = () => (
    <div className='skeleton-book-card'>
        <div className='skeleton-cover'></div>
        <div className='skeleton-content'>
            <div className='skeleton-line skeleton-title'></div>
            <div className='skeleton-line skeleton-author'></div>
            <div className='skeleton-line skeleton-desc'></div>
            <div className='skeleton-line skeleton-desc short'></div>
            <div className='skeleton-btn'></div>
        </div>
    </div>
);

export const SkeletonSearchPage = () => (
    <div>
        {[1, 2, 3, 4, 5].map(i => <SkeletonBookCard key={i} />)}
    </div>
);

export const SkeletonBookCheckout = () => (
    <div className='checkout-page'>
        <div className='container d-none d-lg-block'>
            <div className='row g-5'>
                <div className='col-sm-2 col-md-2 d-flex justify-content-center'>
                    <div className='skeleton-checkout-cover'></div>
                </div>
                <div className='col-4 col-md-4'>
                    <div className='skeleton-line' style={{ width: '70%', height: '28px', marginBottom: '12px' }}></div>
                    <div className='skeleton-line' style={{ width: '40%', height: '18px', marginBottom: '16px' }}></div>
                    <div className='skeleton-line' style={{ width: '100%', height: '14px', marginBottom: '8px' }}></div>
                    <div className='skeleton-line' style={{ width: '100%', height: '14px', marginBottom: '8px' }}></div>
                    <div className='skeleton-line' style={{ width: '80%', height: '14px', marginBottom: '24px' }}></div>
                    <div className='skeleton-line' style={{ width: '120px', height: '24px' }}></div>
                </div>
                <div className='col-3'>
                    <div className='skeleton-checkout-box'></div>
                </div>
            </div>
        </div>
        <div className='container d-lg-none'>
            <div className='d-flex justify-content-center mb-4'>
                <div className='skeleton-checkout-cover'></div>
            </div>
            <div className='skeleton-line' style={{ width: '80%', height: '28px', marginBottom: '12px' }}></div>
            <div className='skeleton-line' style={{ width: '50%', height: '18px', marginBottom: '20px' }}></div>
            <div className='skeleton-checkout-box'></div>
        </div>
    </div>
);
