import { useState } from 'react';
import { Messages } from './components/Messages';
import { PostNewMessage } from './components/PostNewMessages';

export const MessagesPage = () => {

    const [messagesClick, setMessagesClick] = useState(false);

    return (
        <div>
            <div className='page-banner'>
                <div className='container'>
                    <div className='section-label'>Support</div>
                    <h1 className='page-banner-title'>Library Services</h1>
                    <p className='page-banner-subtitle'>
                        Ask the library team a question or check your previous responses
                    </p>
                </div>
            </div>

            <div className='shelf-wrapper'>
                <div className='container'>
                    <nav>
                        <div className='shelf-nav nav nav-tabs' id='nav-tab' role='tablist'>
                            <button
                                onClick={() => setMessagesClick(false)}
                                className='nav-link active'
                                id='nav-send-message-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-send-message'
                                type='button' role='tab'
                                aria-controls='nav-send-message'
                                aria-selected='true'
                            >
                                Submit Question
                            </button>
                            <button
                                onClick={() => setMessagesClick(true)}
                                className='nav-link'
                                id='nav-message-tab'
                                data-bs-toggle='tab'
                                data-bs-target='#nav-message'
                                type='button' role='tab'
                                aria-controls='nav-message'
                                aria-selected='false'
                            >
                                My Q&amp;A
                            </button>
                        </div>
                    </nav>
                    <div className='tab-content' id='nav-tabContent'>
                        <div className='tab-pane fade show active' id='nav-send-message' role='tabpanel'
                            aria-labelledby='nav-send-message-tab'>
                            <PostNewMessage />
                        </div>
                        <div className='tab-pane fade' id='nav-message' role='tabpanel'
                            aria-labelledby='nav-message-tab'>
                            {messagesClick ? <Messages /> : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
