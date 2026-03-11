import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const AdminMessage: React.FC<{
    message: MessageModel,
    submitResponseToQuestion: any
}> = (props) => {

    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');

    function submitBtn() {
        if (props.message.id !== null && response !== '') {
            props.submitResponseToQuestion(props.message.id, response);
            setDisplayWarning(false);
        } else {
            setDisplayWarning(true);
        }
    }

    return (
        <div className='admin-msg-card'>
            <div className='admin-msg-header'>
                <div className='admin-msg-meta'>
                    <span className='admin-msg-case'>Case #{props.message.id}</span>
                    <span className='admin-msg-email'>{props.message.userEmail}</span>
                </div>
                <h5 className='admin-msg-title'>{props.message.title}</h5>
                <p className='admin-msg-question'>{props.message.question}</p>
            </div>

            <div className='admin-msg-response'>
                <div className='admin-msg-response-label'>
                    <span className='section-label'>Your Response</span>
                </div>
                {displayWarning &&
                    <div className='alert alert-danger' role='alert'>
                        Response cannot be empty
                    </div>
                }
                <div className='mb-3'>
                    <textarea
                        className='form-control'
                        rows={3}
                        placeholder='Write your response to the member...'
                        onChange={e => setResponse(e.target.value)}
                        value={response}
                    ></textarea>
                </div>
                <button type='button' className='btn hero-btn-primary' onClick={submitBtn}>
                    Submit Response
                </button>
            </div>
        </div>
    );
}
