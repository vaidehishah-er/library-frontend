import { useState } from 'react';
import AddBookRequest from '../../../models/AddBookRequest';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '../../../context/ToastContext';

export const AddNewBook = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { showToast } = useToast();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: any) {
        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }

    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }

    async function submitNewBook() {
        const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;
        const accessToken = await getAccessTokenSilently();
        if (isAuthenticated && title !== '' && author !== '' && category !== 'Category'
            && description !== '' && copies >= 0) {
            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
            book.img = selectedImage;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            };
            const submitNewBookResponse = await fetch(url, requestOptions);
            if (!submitNewBookResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setAuthor('');
            setDescription('');
            setCopies(0);
            setCategory('Category');
            setSelectedImage(null);
            showToast(`"${title}" added to library!`, 'success');
        } else {
            showToast('Please fill out all fields before submitting.', 'warning');
        }
    }

    return (
        <div className='admin-form-card mt-4'>

            <div className='admin-form-header'>
                <div className='section-label'>New Entry</div>
                <h2 className='admin-form-title'>Add a New Book</h2>
            </div>

            <form method='POST'>
                <div className='row g-3 mb-3'>
                    <div className='col-md-6'>
                        <label className='form-label admin-label'>Title</label>
                        <input
                            type='text'
                            className='form-control'
                            name='title'
                            required
                            placeholder='Book title'
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className='col-md-3'>
                        <label className='form-label admin-label'>Author</label>
                        <input
                            type='text'
                            className='form-control'
                            name='author'
                            required
                            placeholder='Author name'
                            onChange={e => setAuthor(e.target.value)}
                            value={author}
                        />
                    </div>
                    <div className='col-md-3'>
                        <label className='form-label admin-label'>Category</label>
                        <button
                            className='form-control btn btn-secondary dropdown-toggle text-start'
                            type='button'
                            id='dropdownMenuButton1'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            {category}
                        </button>
                        <ul className='dropdown-menu w-100' aria-labelledby='dropdownMenuButton1'>
                            <li><a onClick={() => categoryField('FE')} className='dropdown-item' href='#'>Front End</a></li>
                            <li><a onClick={() => categoryField('BE')} className='dropdown-item' href='#'>Back End</a></li>
                            <li><a onClick={() => categoryField('Data')} className='dropdown-item' href='#'>Data</a></li>
                            <li><a onClick={() => categoryField('DevOps')} className='dropdown-item' href='#'>DevOps</a></li>
                            <li><a onClick={() => categoryField('Fiction')} className='dropdown-item' href='#'>Fiction</a></li>
                            <li><a onClick={() => categoryField('Science')} className='dropdown-item' href='#'>Science</a></li>
                            <li><a onClick={() => categoryField('History')} className='dropdown-item' href='#'>History</a></li>
                            <li><a onClick={() => categoryField('Biography')} className='dropdown-item' href='#'>Biography</a></li>
                            <li><a onClick={() => categoryField('Biology')} className='dropdown-item' href='#'>Biology</a></li>
                        </ul>
                    </div>
                </div>

                <div className='mb-3'>
                    <label className='form-label admin-label'>Description</label>
                    <textarea
                        className='form-control'
                        rows={4}
                        placeholder='Enter a description of the book...'
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                    ></textarea>
                </div>

                <div className='row g-3 mb-4'>
                    <div className='col-md-3'>
                        <label className='form-label admin-label'>Number of Copies</label>
                        <input
                            type='number'
                            className='form-control'
                            name='Copies'
                            required
                            min={0}
                            onChange={e => setCopies(Number(e.target.value))}
                            value={copies}
                        />
                    </div>
                    <div className='col-md-9 d-flex align-items-end'>
                        <div>
                            <label className='form-label admin-label d-block'>Cover Image (optional)</label>
                            <input
                                type='file'
                                className='admin-file-picker'
                                accept='image/*'
                                onChange={e => base64ConversionForImages(e)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <button type='button' className='btn hero-btn-primary btn-lg' onClick={submitNewBook}>
                        Add Book to Library
                    </button>
                </div>
            </form>
        </div>
    );
}
