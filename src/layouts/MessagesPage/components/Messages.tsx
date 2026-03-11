import { useEffect, useState } from 'react';
import MessageModel from '../../../models/MessageModel';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { Pagination } from '../../Utils/Pagination';
import { useAuth0 } from '@auth0/auth0-react';

export const Messages = () => {

    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (isAuthenticated) {
                const accessToken = await getAccessTokenSilently();
                const url = `${process.env.REACT_APP_API}/messages/search/findByUserEmail?userEmail=${user?.email}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        } 
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.messages);
        })
        window.scrollTo(0, 0);
    }, [isAuthenticated, user, getAccessTokenSilently, currentPage]);

    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-4'>
            {messages.length > 0 ?
                <>
                    <div className='admin-section-header'>
                        <div className='section-label'>My Q&amp;A</div>
                        <h2 className='admin-section-title'>
                            Your Questions
                            <span className='admin-msg-count'>{messages.length}</span>
                        </h2>
                    </div>
                    {messages.map(message => (
                        <div className='admin-msg-card' key={message.id}>
                            <div className='admin-msg-header'>
                                <div className='admin-msg-meta'>
                                    <span className='admin-msg-case'>Case #{message.id}</span>
                                    <span className='admin-msg-email'>{message.userEmail}</span>
                                </div>
                                <h5 className='admin-msg-title'>{message.title}</h5>
                                <p className='admin-msg-question'>{message.question}</p>
                            </div>
                            <div className='admin-msg-response'>
                                <div className='admin-msg-response-label'>
                                    <span className='section-label'>Response</span>
                                </div>
                                {message.response && message.adminEmail ?
                                    <>
                                        <p className='admin-msg-email mb-1'>{message.adminEmail} <span style={{opacity: 0.6}}>(admin)</span></p>
                                        <p className='mb-0'>{message.response}</p>
                                    </>
                                    :
                                    <p className='mb-0' style={{fontStyle: 'italic', opacity: 0.7}}>
                                        Pending response from the library team. We'll get back to you shortly.
                                    </p>
                                }
                            </div>
                        </div>
                    ))}
                </>
                :
                <div className='empty-shelf mt-4'>
                    <h3>No questions yet</h3>
                    <p className='text-muted'>Questions you submit will appear here along with admin responses.</p>
                </div>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}