import { useState } from "react";
import { HistoryPage } from "./components/HistoryPage";
import { Loans } from "./components/Loans";

export const ShelfPage = () => {

    const [historyClick, setHistoryClick] = useState(false);

    return (
        <div>
            {/* Page Banner */}
            <div className='page-banner'>
                <div className='container'>
                    <div className='section-label'>My Account</div>
                    <h1 className='page-banner-title'>My Shelf</h1>
                    <p className='page-banner-subtitle'>
                        Manage your current loans and browse your reading history
                    </p>
                </div>
            </div>

            <div className='shelf-wrapper'>
                <div className='container'>
                    <nav>
                        <div className='shelf-nav nav nav-tabs' id='nav-tab' role='tablist'>
                            <button
                                onClick={() => setHistoryClick(false)}
                                className='nav-link active'
                                id='nav-loans-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-loans'
                                type='button'
                                role='tab'
                                aria-controls='nav-loans'
                                aria-selected='true'
                            >
                                Current Loans
                            </button>
                            <button
                                onClick={() => setHistoryClick(true)}
                                className='nav-link'
                                id='nav-history-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-history'
                                type='button'
                                role='tab'
                                aria-controls='nav-history'
                                aria-selected='false'
                            >
                                Reading History
                            </button>
                        </div>
                    </nav>
                    <div className='tab-content' id='nav-tabContent'>
                        <div className='tab-pane fade show active' id='nav-loans' role='tabpanel'
                            aria-labelledby='nav-loans-tab'>
                            <Loans />
                        </div>
                        <div className='tab-pane fade' id='nav-history' role='tabpanel'
                            aria-labelledby='nav-history-tab'>
                            {historyClick ? <HistoryPage /> : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
