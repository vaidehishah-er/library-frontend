import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <div className='main-color'>
            <footer className='container d-flex flex-wrap justify-content-between align-items-center py-4'>
                <div className='col-md-5 mb-2 mb-md-0'>
                    <Link to='/home' className='footer-brand d-block mb-1'>&#128218; Love to Read</Link>
                    <p className='footer-tagline'>"A reader lives a thousand lives before he dies."</p>
                    <p className='footer-copy mt-2'>© {new Date().getFullYear()} Love to Read, Inc.</p>
                </div>
                <ul className='nav col-md-4 justify-content-end list-unstyled d-flex gap-1'>
                    <li>
                        <Link to='/home' className='footer-nav-link'>Home</Link>
                    </li>
                    <li>
                        <Link to='/search' className='footer-nav-link'>Search</Link>
                    </li>
                    <li>
                        <Link to='/shelf' className='footer-nav-link'>My Shelf</Link>
                    </li>
                    <li>
                        <Link to='/messages' className='footer-nav-link'>Support</Link>
                    </li>
                </ul>
            </footer>
        </div>
    );
}