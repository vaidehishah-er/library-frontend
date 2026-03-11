import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HistoryModel from '../../../models/HistoryModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { useAuth0 } from '@auth0/auth0-react';

export const HistoryPage = () => {

    const { isAuthenticated, user } = useAuth0();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [histories, setHistories] = useState<HistoryModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/histories/search/findBooksByUserEmail?userEmail=${user?.email}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                const historyResponse = await fetch(url, requestOptions);
                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const historyResponseJson = await historyResponse.json();
                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);
            }
            setIsLoadingHistory(false);
        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })
    }, [isAuthenticated, user, currentPage]);

    if (isLoadingHistory) {
        return <SpinnerLoading />;
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
            {histories.length > 0 ?
                <>
                    <h5 className='history-section-title'>
                        Reading History
                    </h5>
                    {histories.map(history => (
                        <div className='history-card' key={history.id}>
                            <div className='d-none d-lg-block'>
                                {history.img ?
                                    <img src={history.img} width='100' height='160' alt='Book' />
                                    :
                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                        width='100' height='160' alt='Book' />
                                }
                            </div>
                            <div className='d-lg-none d-flex justify-content-center'>
                                {history.img ?
                                    <img src={history.img} width='100' height='160' alt='Book' />
                                    :
                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                        width='100' height='160' alt='Book' />
                                }
                            </div>
                            <div className='flex-grow-1'>
                                <p className='history-book-author'>{history.author}</p>
                                <h5 className='history-book-title'>{history.title}</h5>
                                <p className='history-book-desc'>{history.description}</p>
                                <div className='history-dates'>
                                    <div className='history-date-item'>
                                        <span className='history-date-label'>Checked Out</span>
                                        <span className='history-date-value'>{history.checkoutDate}</span>
                                    </div>
                                    <div className='history-date-item'>
                                        <span className='history-date-label'>Returned</span>
                                        <span className='history-date-value'>{history.returnedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <div className='empty-shelf'>
                    <h3>No reading history yet</h3>
                    <p className='text-muted mb-4'>Books you've returned will appear here.</p>
                    <Link className='btn hero-btn-primary btn-lg' to='search'>
                        Find a Book
                    </Link>
                </div>
            }
            {totalPages > 1 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </div>
    );
}
