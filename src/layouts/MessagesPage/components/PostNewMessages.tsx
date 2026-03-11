import { useState } from 'react';
import MessageModel from '../../../models/MessageModel';
import { useAuth0 } from '@auth0/auth0-react';

export const PostNewMessage = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };
            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if (!submitNewQuestionResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='admin-form-card mt-4'>
            <div className='admin-form-header'>
                <div className='section-label'>New Question</div>
                <h2 className='admin-form-title'>Ask the Library Team</h2>
            </div>

            {displayWarning &&
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            {displaySuccess &&
                <div className='alert alert-success' role='alert'>
                    &#10003; Question submitted — we'll respond shortly
                </div>
            }

            <form method='POST'>
                <div className='mb-3'>
                    <label className='form-label admin-label'>Title</label>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Brief title for your question'
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                    />
                </div>
                <div className='mb-4'>
                    <label className='form-label admin-label'>Question</label>
                    <textarea
                        className='form-control'
                        rows={4}
                        placeholder='Describe your question in detail...'
                        onChange={e => setQuestion(e.target.value)}
                        value={question}
                    ></textarea>
                </div>
                <button type='button' className='btn hero-btn-primary' onClick={submitNewQuestion}>
                    Submit Question
                </button>
            </form>
        </div>
    );
}
