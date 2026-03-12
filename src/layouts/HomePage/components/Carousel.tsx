import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { ReturnBook } from "./ReturnBook";

const CATEGORIES = [
    { key: 'FE',        label: 'Front End',  color: '#1a6fa0' },
    { key: 'BE',        label: 'Back End',   color: '#c9a84c' },
    { key: 'Data',      label: 'Data',       color: '#2890cc' },
    { key: 'DevOps',    label: 'DevOps',     color: '#a07830' },
    { key: 'Fiction',   label: 'Fiction',    color: '#8b5cf6' },
    { key: 'Science',   label: 'Science',    color: '#06b6d4' },
    { key: 'History',   label: 'History',    color: '#f59e0b' },
    { key: 'Biography', label: 'Biography',  color: '#10b981' },
    { key: 'Biology',   label: 'Biology',    color: '#84cc16' },
];

interface CategorizedBook extends BookModel {
    categoryLabel: string;
    categoryColor: string;
}

export const Carousel = () => {

    const [books, setBooks] = useState<CategorizedBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    // Sync React dot state with Bootstrap carousel slide events
    useEffect(() => {
        const el = document.getElementById('carouselExampleControls');
        if (!el) return;
        const handler = (e: any) => setActiveSlide(e.to);
        el.addEventListener('slide.bs.carousel', handler);
        return () => el.removeEventListener('slide.bs.carousel', handler);
    }, [books]); // re-attach after books load so the element exists

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl = process.env.REACT_APP_API;
            const loaded: CategorizedBook[] = [];

            for (const cat of CATEGORIES) {
                const res = await fetch(
                    `${baseUrl}/books/search/findByCategory?category=${cat.key}&page=0&size=1`
                );
                if (!res.ok) continue;
                const json = await res.json();
                const data = json._embedded?.books;
                if (!data || data.length === 0) continue;
                const b = data[0];
                loaded.push({
                    id: b.id,
                    title: b.title,
                    author: b.author,
                    description: b.description,
                    copies: b.copies,
                    copiesAvailable: b.copiesAvailable,
                    category: b.category,
                    img: b.img,
                    categoryLabel: cat.label,
                    categoryColor: cat.color,
                });
            }

            setBooks(loaded);
            setIsLoading(false);
        };
        fetchBooks().catch((err: any) => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, []);

    if (isLoading) return <SpinnerLoading />;
    if (httpError) return <div className='container m-5'><p>{httpError}</p></div>;

    // 3 books per slide
    const slides: CategorizedBook[][] = [];
    for (let i = 0; i < books.length; i += 3) {
        slides.push(books.slice(i, i + 3));
    }

    return (
        <div className='carousel-section'>
            <div className='container'>
                <div className='section-header'>
                    <div className='section-label'>Featured Collection</div>
                    <h2 className='section-title'>Explore Every Category</h2>
                    <p className='carousel-subtitle'>
                        One standout title from every corner of our library.
                    </p>
                </div>

                {/* Desktop Carousel */}
                <div
                    id='carouselExampleControls'
                    className='carousel slide d-none d-lg-block'
                    data-bs-interval='false'
                >
                    <div className='carousel-inner'>
                        {slides.map((slide, idx) => (
                            <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                                <div className='row d-flex justify-content-center align-items-stretch g-4'>
                                    {slide.map(book => (
                                        <ReturnBook
                                            book={book}
                                            key={book.id}
                                            categoryLabel={book.categoryLabel}
                                            categoryColor={book.categoryColor}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>

                </div>

                {/* Dots driven by React state — outside Bootstrap carousel so no conflict */}
                <div className='carousel-dot-indicators'>
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            type='button'
                            className={`carousel-dot${idx === activeSlide ? ' active' : ''}`}
                            data-bs-target='#carouselExampleControls'
                            data-bs-slide-to={idx}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Mobile — first 3 categories */}
                <div className='d-lg-none mt-3'>
                    <div className='row d-flex justify-content-center align-items-stretch g-4'>
                        {books.slice(0, 3).map(book => (
                            <ReturnBook
                                book={book}
                                key={book.id}
                                categoryLabel={book.categoryLabel}
                                categoryColor={book.categoryColor}
                            />
                        ))}
                    </div>
                </div>

                <div className='text-center carousel-cta'>
                    <Link className='carousel-view-all' to='/search'>
                        View All Books
                    </Link>
                </div>
            </div>
        </div>
    );
};
