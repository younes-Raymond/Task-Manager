import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {

    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products');
        }
    }

    return (
        <form onSubmit={handleSubmit} className=".form">
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="" type="text" placeholder="Search for products, brands and more" />
            <button type="submit" className=""><SearchIcon /></button>
        </form>
    );
};

export default Searchbar;
