import React from 'react';
import { Link } from 'react-router-dom';

const RecommendationList = ({ recommendations = [] }) => {
  if (!recommendations.length) return null;
  
  return (
    <section className="recommendations">
      <div className="container">
        <div className="row">
          <div className="col-xl-10 offset-xl-1">
            <h2>You May Also Like</h2>
            <div className="row">
              {recommendations.map((product) => (
                <div key={product.id} className="col-md-3">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <img alt={product.name} src={product.picture} />
                    </Link>
                    <div>
                      <h5>{product.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationList;