import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

// ── Inner form (must live inside <Elements>) ───────────────────────────────
const CheckoutForm: React.FC<{ amount: number; onSuccess: () => void }> = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { getAccessTokenSilently, user } = useAuth0();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            const accessToken = await getAccessTokenSilently();

            // 1. Create PaymentIntent on backend
            const intentRes = await fetch(
                `${process.env.REACT_APP_API}/payment/secure/payment-intent`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: Math.round(amount * 100), // convert to paise
                        currency: 'inr',
                        receiptEmail: user?.email,
                    }),
                }
            );

            if (!intentRes.ok) throw new Error('Could not create payment intent');
            const intentData = await intentRes.json();

            // 2. Confirm card payment with Stripe
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error('Card element not found');

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                intentData.client_secret,
                { payment_method: { card: cardElement } }
            );

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
                setProcessing(false);
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                // 3. Notify backend payment is complete
                await fetch(
                    `${process.env.REACT_APP_API}/payment/secure/payment-complete`,
                    {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                onSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
        setProcessing(false);
    };

    const cardElementOptions = {
        style: {
            base: {
                color: '#e2e8f0',
                fontFamily: '"Inter", sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#64748b' },
                iconColor: '#c9a84c',
            },
            invalid: { color: '#ef4444', iconColor: '#ef4444' },
        },
    };

    return (
        <form onSubmit={handleSubmit} className='payment-form'>
            <div className='payment-card-input'>
                <label className='form-label admin-label'>Card Details</label>
                <div className='stripe-card-wrapper'>
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {error && (
                <div className='payment-error'>
                    {error}
                </div>
            )}

            <button
                type='submit'
                className='btn hero-btn-primary btn-lg w-100 mt-3'
                disabled={!stripe || processing}
            >
                {processing ? 'Processing…' : `Pay ₹${amount.toFixed(2)}`}
            </button>

            <p className='payment-secure-note'>
                Secured by Stripe — we never store your card details.
            </p>

            {/* Stripe test card hint */}
            <div className='payment-test-hint'>
                <strong>Test card:</strong> 4242 4242 4242 4242 &nbsp;|&nbsp; Any future expiry &nbsp;|&nbsp; Any CVC
            </div>
        </form>
    );
};

// ── Outer page ─────────────────────────────────────────────────────────────
export const PaymentPage = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    const stripePromise = stripeKey?.startsWith('pk_') ? loadStripe(stripeKey) : null;
    const [fees, setFees] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchFees = async () => {
            const accessToken = await getAccessTokenSilently();
            const res = await fetch(`${process.env.REACT_APP_API}/payment/secure`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) throw new Error('Could not fetch fees');
            const data = await res.json();
            setFees(data.amount);
            setIsLoading(false);
        };
        fetchFees().catch(() => setIsLoading(false));
    }, [isAuthenticated, getAccessTokenSilently]);

    if (isLoading) return <SpinnerLoading />;

    return (
        <div className='payment-page'>
            {/* Banner */}
            <div className='page-banner'>
                <div className='container'>
                    <div className='section-label'>Account</div>
                    <h1 className='page-banner-title'>Late Fee Payment</h1>
                    <p className='page-banner-subtitle'>
                        Clear your outstanding balance to re-enable loan renewals.
                    </p>
                </div>
            </div>

            <div className='payment-wrapper'>
                <div className='container'>
                    {paid ? (
                        // ── Success state ──────────────────────────────
                        <div className='payment-success-card'>
                            <div className='payment-success-icon'>
                                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'
                                    strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                                    width='48' height='48'>
                                    <polyline points='20 6 9 17 4 12' />
                                </svg>
                            </div>
                            <h2 className='payment-success-title'>Payment Successful</h2>
                            <p className='payment-success-sub'>
                                Your account is now clear. You can renew your loans again.
                            </p>
                            <Link to='/shelf' className='btn hero-btn-primary btn-lg mt-3'>
                                Go to My Shelf
                            </Link>
                        </div>
                    ) : fees !== null && fees > 0 ? (
                        // ── Payment form ───────────────────────────────
                        <div className='payment-grid'>
                            {/* Left — summary */}
                            <div className='payment-summary-card'>
                                <h3 className='payment-summary-title'>Outstanding Balance</h3>
                                <div className='payment-amount-display'>
                                    ₹{fees.toFixed(2)}
                                </div>
                                <p className='payment-summary-desc'>
                                    Late fees are charged at <strong>₹91.00 per day</strong> for each
                                    overdue book. Return or renew your books on time to avoid future charges.
                                </p>
                                <hr className='payment-divider' />
                                <div className='payment-info-row'>
                                    <span>Late fee rate</span>
                                    <span>₹91.00 / day / book</span>
                                </div>
                                <div className='payment-info-row payment-info-total'>
                                    <span>Total due</span>
                                    <span>₹{fees.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Right — Stripe form */}
                            <div className='payment-form-card'>
                                <h3 className='payment-form-title'>Pay with Card</h3>
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm amount={fees} onSuccess={() => setPaid(true)} />
                                </Elements>
                            </div>
                        </div>
                    ) : (
                        // ── No fees ────────────────────────────────────
                        <div className='payment-clear-card'>
                            <div className='payment-success-icon'>
                                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'
                                    strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
                                    width='48' height='48'>
                                    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
                                    <polyline points='22 4 12 14.01 9 11.01' />
                                </svg>
                            </div>
                            <h2 className='payment-success-title'>No Outstanding Fees</h2>
                            <p className='payment-success-sub'>
                                Your account is in good standing. Enjoy your books!
                            </p>
                            <Link to='/shelf' className='btn hero-btn-primary btn-lg mt-3'>
                                Go to My Shelf
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
