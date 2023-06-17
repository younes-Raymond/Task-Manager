import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { search } from '../../actions/userAction';

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await search(keyword);
        console.log('data: ', data);
        setFilteredMaterials(data?.materials || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [keyword]);
  

  return (
    <div className="materials-container">
      <div className="helloworld">
        <h1>hello world im search component </h1>
      </div>
      {filteredMaterials.length > 0 ? (
        filteredMaterials.map((material) => (
          <div className="container" key={material._id}>
            <div className="image-container">
              <img src={material.images.url} alt="" />
            </div>
            <div>
              <strong>{material.name}</strong>({material.description})
            </div>
            <label htmlFor="stock">
              Stock:
              <p className={`counter ${material.stock > 0 ? 'green' : 'red'}`}>
                {material.stock}
              </p>
            </label>
            <div>
              <p>category: {material.category}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No materials found.</p>
      )}
    </div>
  );
};

export default Search;
