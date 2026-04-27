import React from 'react';
import styled from 'styled-components';

const categories = [
    { name: 'Signature Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800' },
    { name: 'Cupcakes', image: 'https://images.unsplash.com/photo-1596803244618-8dbee441d70b?w=800' },
    { name: 'Brownies & Cookies', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e3047f1?w=800' },
    { name: 'Pastries', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800' },
    { name: 'Custom Bakes', image: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=800' },
];

const CakeCategories = () => {
    return (
        <SectionWrapper>
            <div className="container">
                <div className="section-header">
                    <span className="subtitle">Discover</span>
                    <h2 className="title">Our Categories</h2>
                </div>
                <StyledWrapper>
                    <div className="card">
                        {categories.map((cat, index) => (
                            <div key={index} className="category-item" style={{ '--bg-image': `url(${cat.image})` }}>
                                <span>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </StyledWrapper>
            </div>
        </SectionWrapper>
    );
};

const SectionWrapper = styled.section`
  padding: 80px 0;
  background: #FAF6F0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 50px;
  }

  .subtitle {
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    color: #C9A27E;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #3B2A25;
    margin: 0;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;

  .card {
    width: 100%;
    max-width: 1000px;
    height: 400px;
    border-radius: 12px;
    background: #3B2A25;
    display: flex;
    gap: 8px;
    padding: 8px;
    box-shadow: 0 20px 40px rgba(59, 42, 37, 0.15);
  }

  .category-item {
    height: 100%;
    flex: 1;
    overflow: hidden;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    background: #4A332C;
    border: 1px solid rgba(201, 162, 126, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  /* Background image that appears on hover */
  .category-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1;
  }

  /* Dark gradient overlay to keep text readable */
  .category-item::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(59,42,37,0.85) 0%, rgba(59,42,37,0.3) 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 2;
  }

  .category-item:hover {
    flex: 4;
    border-color: #C9A27E;
  }

  .category-item:hover::before,
  .category-item:hover::after {
    opacity: 1;
  }

  .category-item span {
    min-width: 14em;
    padding: 0.5em;
    text-align: center;
    transform: rotate(-90deg);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    color: #C9A27E;
    letter-spacing: 0.15em;
    font-weight: 700;
    font-size: 1.1rem;
    z-index: 3;
    white-space: nowrap;
  }

  .category-item:hover span {
    transform: rotate(0);
    color: #FFF;
    font-size: 1.4rem;
    text-shadow: 0 2px 10px rgba(0,0,0,0.6);
  }

  @media (max-width: 768px) {
    .card {
      height: 600px;
      flex-direction: column;
    }

    .category-item span {
      transform: rotate(0);
    }
    
    .category-item:hover span {
      transform: scale(1.1);
    }
  }
`;

export default CakeCategories;
