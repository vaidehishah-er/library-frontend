import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import BookModel from '../../../models/BookModel';

type ReadStatus = 'want' | 'reading' | 'finished';

interface ProgressEntry {
    bookId: number;
    status: ReadStatus;
    pagesRead: number;
    totalPages: number;
    addedDate: string;
}

interface BookProgress extends ProgressEntry {
    book?: BookModel;
}

const STATUS_LABELS: Record<ReadStatus, string> = {
    want: 'Want to Read',
    reading: 'Currently Reading',
    finished: 'Finished',
};

const STATUS_COLORS: Record<ReadStatus, string> = {
    want: '#64748b',
    reading: '#1a6fa0',
    finished: '#2a9d5c',
};

const STORAGE_KEY = 'ltr-reading-progress';

function loadProgress(): ProgressEntry[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveProgress(entries: ProgressEntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export const ReadingProgress = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [entries, setEntries] = useState<BookProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved entries and enrich with book data
    useEffect(() => {
        const saved = loadProgress();
        if (saved.length === 0) {
            setIsLoading(false);
            return;
        }

        const fetchBooks = async () => {
            const enriched: BookProgress[] = await Promise.all(
                saved.map(async (entry) => {
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API}/books/${entry.bookId}`);
                        if (res.ok) {
                            const data = await res.json();
                            const book: BookModel = {
                                id: data.id,
                                title: data.title,
                                author: data.author,
                                description: data.description,
                                copies: data.copies,
                                copiesAvailable: data.copiesAvailable,
                                category: data.category,
                                img: data.img,
                            };
                            return { ...entry, book };
                        }
                    } catch {}
                    return entry;
                })
            );
            setEntries(enriched);
            setIsLoading(false);
        };

        fetchBooks();
    }, []);

    const updateStatus = (bookId: number, status: ReadStatus) => {
        const saved = loadProgress();
        const idx = saved.findIndex(e => e.bookId === bookId);
        if (idx !== -1) {
            saved[idx].status = status;
            saveProgress(saved);
            setEntries(prev =>
                prev.map(e => (e.bookId === bookId ? { ...e, status } : e))
            );
        }
    };

    const updatePages = (bookId: number, pagesRead: number) => {
        const saved = loadProgress();
        const idx = saved.findIndex(e => e.bookId === bookId);
        if (idx !== -1) {
            saved[idx].pagesRead = pagesRead;
            saveProgress(saved);
            setEntries(prev =>
                prev.map(e => (e.bookId === bookId ? { ...e, pagesRead } : e))
            );
        }
    };

    const removeEntry = (bookId: number) => {
        const saved = loadProgress().filter(e => e.bookId !== bookId);
        saveProgress(saved);
        setEntries(prev => prev.filter(e => e.bookId !== bookId));
    };

    if (isLoading) {
        return (
            <div className='reading-progress-wrapper mt-4'>
                {[1, 2, 3].map(i => (
                    <div key={i} className='progress-card skeleton-progress-card'>
                        <div className='skeleton-line' style={{ width: '60%', height: 20, marginBottom: 8 }}></div>
                        <div className='skeleton-line' style={{ width: '40%', height: 14 }}></div>
                    </div>
                ))}
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className='empty-shelf mt-4'>
                <div className='empty-shelf-icon'>📖</div>
                <h3>No books tracked yet</h3>
                <p className='text-muted'>
                    Visit a book's page and click <strong>"Track Reading"</strong> to add it here.
                </p>
            </div>
        );
    }

    const byStatus = (status: ReadStatus) => entries.filter(e => e.status === status);

    return (
        <div className='reading-progress-wrapper mt-4'>
            {(['reading', 'want', 'finished'] as ReadStatus[]).map(status => {
                const group = byStatus(status);
                if (group.length === 0) return null;
                return (
                    <div key={status} className='progress-group'>
                        <h5 className='progress-group-title' style={{ color: STATUS_COLORS[status] }}>
                            {STATUS_LABELS[status]}
                            <span className='progress-group-count'>{group.length}</span>
                        </h5>
                        {group.map(entry => {
                            const pct = entry.totalPages > 0
                                ? Math.min(100, Math.round((entry.pagesRead / entry.totalPages) * 100))
                                : 0;
                            return (
                                <div key={entry.bookId} className='progress-card'>
                                    <div className='progress-card-left'>
                                        {entry.book?.img
                                            ? <img src={entry.book.img} alt={entry.book?.title} className='progress-book-img' />
                                            : <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')} alt='Book' className='progress-book-img' />
                                        }
                                    </div>
                                    <div className='progress-card-body'>
                                        <div className='progress-book-title'>{entry.book?.title || `Book #${entry.bookId}`}</div>
                                        <div className='progress-book-author'>{entry.book?.author || ''}</div>

                                        {/* Status selector */}
                                        <div className='progress-status-row'>
                                            {(['want', 'reading', 'finished'] as ReadStatus[]).map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(entry.bookId, s)}
                                                    className={`progress-status-btn ${entry.status === s ? 'active' : ''}`}
                                                    style={entry.status === s ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
                                                >
                                                    {STATUS_LABELS[s]}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Page progress */}
                                        {entry.status === 'reading' && (
                                            <div className='progress-pages-row'>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={entry.totalPages || 9999}
                                                    value={entry.pagesRead}
                                                    onChange={e => updatePages(entry.bookId, Number(e.target.value))}
                                                    className='progress-pages-input'
                                                />
                                                <span className='progress-pages-sep'>of</span>
                                                <input
                                                    type='number'
                                                    min={1}
                                                    value={entry.totalPages || ''}
                                                    placeholder='total pages'
                                                    onChange={e => {
                                                        const saved = loadProgress();
                                                        const idx = saved.findIndex(x => x.bookId === entry.bookId);
                                                        if (idx !== -1) {
                                                            saved[idx].totalPages = Number(e.target.value);
                                                            saveProgress(saved);
                                                            setEntries(prev =>
                                                                prev.map(x => x.bookId === entry.bookId ? { ...x, totalPages: Number(e.target.value) } : x)
                                                            );
                                                        }
                                                    }}
                                                    className='progress-pages-input'
                                                />
                                                <span className='progress-pages-sep'>pages</span>
                                                {entry.totalPages > 0 && (
                                                    <span className='progress-pct'>{pct}%</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Progress bar */}
                                        {entry.status === 'reading' && entry.totalPages > 0 && (
                                            <div className='progress-bar-track'>
                                                <div
                                                    className='progress-bar-fill'
                                                    style={{ width: `${pct}%` }}
                                                ></div>
                                            </div>
                                        )}

                                        {entry.status === 'finished' && (
                                            <div className='progress-finished-badge'>
                                                ✓ Completed on {new Date(entry.addedDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className='progress-remove-btn'
                                        onClick={() => removeEntry(entry.bookId)}
                                        aria-label='Remove from tracking'
                                        title='Remove'
                                    >✕</button>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

// Helper exported so BookCheckoutPage can add a book to tracking
export function trackBook(bookId: number, status: ReadStatus = 'want') {
    const saved = loadProgress();
    if (saved.some(e => e.bookId === bookId)) return; // already tracked
    saved.push({ bookId, status, pagesRead: 0, totalPages: 0, addedDate: new Date().toISOString() });
    saveProgress(saved);
}

export function isTracked(bookId: number): boolean {
    return loadProgress().some(e => e.bookId === bookId);
}
