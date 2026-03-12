import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { AddNewBook } from './components/AddNewBook';
import { AdminMessages } from './components/AdminMessages';
import { ChangeQuantityOfBooks } from './components/ChangeQuantityOfBooks';
import { Analytics } from './components/Analytics';
import { useAuth0 } from '@auth0/auth0-react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const ManageLibraryPage = () => {

    const { getIdTokenClaims } = useAuth0();
    const [roles, setRoles] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);
    const [analyticsClick, setAnalyticsClick] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            const claims = await getIdTokenClaims();
            const fetchedRoles = claims?.['https://luv2code-react-library.com/roles'] || [];
            setRoles(fetchedRoles);
            setLoading(false);
        };
        fetchRoles();
    }, [getIdTokenClaims]);

    function addBookClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
        setAnalyticsClick(false);
    }

    function changeQuantityOfBooksClickFunction() {
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
        setAnalyticsClick(false);
    }

    function messagesClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
        setAnalyticsClick(false);
    }

    function analyticsClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
        setAnalyticsClick(true);
    }

    if (loading) {
        return <SpinnerLoading />;
    }

    if (!roles?.includes('admin')) {
        return <Redirect to='/home' />;
    }

    return (
        <div>
            {/* Page Banner */}
            <div className='page-banner'>
                <div className='container'>
                    <div className='section-label'>Administration</div>
                    <h1 className='page-banner-title'>Manage Library</h1>
                    <p className='page-banner-subtitle'>
                        Add books, manage inventory, and respond to member messages
                    </p>
                </div>
            </div>

            <div className='shelf-wrapper'>
                <div className='container'>
                    <nav>
                        <div className='shelf-nav nav nav-tabs' id='nav-tab' role='tablist'>
                            <button
                                onClick={addBookClickFunction}
                                className='nav-link active'
                                id='nav-add-book-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-add-book'
                                type='button'
                                role='tab'
                                aria-controls='nav-add-book'
                                aria-selected='true'
                            >
                                Add New Book
                            </button>
                            <button
                                onClick={changeQuantityOfBooksClickFunction}
                                className='nav-link'
                                id='nav-quantity-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-quantity'
                                type='button'
                                role='tab'
                                aria-controls='nav-quantity'
                                aria-selected='false'
                            >
                                Manage Inventory
                            </button>
                            <button
                                onClick={messagesClickFunction}
                                className='nav-link'
                                id='nav-messages-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-messages'
                                type='button'
                                role='tab'
                                aria-controls='nav-messages'
                                aria-selected='false'
                            >
                                Messages
                            </button>
                            <button
                                onClick={analyticsClickFunction}
                                className='nav-link'
                                id='nav-analytics-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-analytics'
                                type='button'
                                role='tab'
                                aria-controls='nav-analytics'
                                aria-selected='false'
                            >
                                Analytics
                            </button>
                        </div>
                    </nav>
                    <div className='tab-content' id='nav-tabContent'>
                        <div className='tab-pane fade show active' id='nav-add-book' role='tabpanel'
                            aria-labelledby='nav-add-book-tab'>
                            <AddNewBook />
                        </div>
                        <div className='tab-pane fade' id='nav-quantity' role='tabpanel'
                            aria-labelledby='nav-quantity-tab'>
                            {changeQuantityOfBooksClick ? <ChangeQuantityOfBooks /> : <></>}
                        </div>
                        <div className='tab-pane fade' id='nav-messages' role='tabpanel'
                            aria-labelledby='nav-messages-tab'>
                            {messagesClick ? <AdminMessages /> : <></>}
                        </div>
                        <div className='tab-pane fade' id='nav-analytics' role='tabpanel'
                            aria-labelledby='nav-analytics-tab'>
                            {analyticsClick ? <Analytics /> : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
