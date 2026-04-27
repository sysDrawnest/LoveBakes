import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Cake, Clock, Heart, Leaf, Award, Truck } from 'lucide-react';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Baked with Love",
            description: "Every cake is handmade with passion and care, just like home-baked goodies from mom's kitchen."
        },
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "100% Fresh Ingredients",
            description: "No preservatives, no shortcuts. Only the finest ingredients go into our cakes."
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Fresh Daily",
            description: "We bake fresh every morning. What you order is what we bake that day."
        },
        {
            icon: <Cake className="w-6 h-6" />,
            title: "Custom Designs",
            description: "Dream it, we'll create it. Any flavor, any design, any size."
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "500+ Happy Customers",
            description: "Join our family of satisfied cake lovers who keep coming back for more."
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Free Delivery",
            description: "Complimentary delivery within city limits for orders above ₹499."
        }
    ];

    return (
        <StyledSection>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="subtitle">Why LoveBakes?</span>
                    <h2 className="title">What Makes Us <span>Special</span></h2>
                    <p className="description">
                        We don't just bake cakes — we create sweet memories that last a lifetime.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="cards-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card feature={feature} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </StyledSection>
    );
};

// Individual Card Component
const Card = ({ feature }) => {
    return (
        <StyledWrapper>
            <div className="card">
                <div className="align">
                    <span className="red" />
                    <span className="yellow" />
                    <span className="green" />
                </div>

                <div className="icon-container">
                    {feature.icon}
                </div>

                <h1>{feature.title}</h1>

                <p>
                    {feature.description}
                </p>

                <div className="hover-content">
                    <span className="learn-more">Learn more →</span>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    max-width: 320px;
    height: 200px;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border-bottom: 3px solid rgba(200, 182, 166, 0.5);
    border-left: 2px rgba(200, 182, 166, 0.5) outset;
    box-shadow: 0 20px 30px rgba(74, 51, 44, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    color: #4A332C;
    position: relative;
    cursor: pointer;
  }

  .card:hover {
    height: 300px;
    transform: translateY(-10px);
    background: white;
    box-shadow: 0 30px 40px rgba(74, 51, 44, 0.15);
    border-bottom: 3px solid #C8B6A6;
  }

  .align {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: row;
    gap: 6px;
    margin-bottom: 1rem;
  }

  .red {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ff605c;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .yellow {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ffbd44;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .green {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #00ca4e;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .icon-container {
    width: 50px;
    height: 50px;
    background: #FFF8F5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: #4A332C;
    transition: all 0.3s ease;
  }

  .card:hover .icon-container {
    background: #4A332C;
    color: white;
    transform: scale(1.1);
  }

  .card h1 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0.8rem 0;
    color: #4A332C;
    text-align: left;
    text-shadow: none;
  }

  .card p {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #666;
    margin: 0;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .hover-content {
    position: absolute;
    bottom: -50px;
    left: 1.5rem;
    right: 1.5rem;
    transition: bottom 0.4s ease;
    opacity: 0;
  }

  .card:hover .hover-content {
    bottom: 1.5rem;
    opacity: 1;
  }

  .learn-more {
    color: #4A332C;
    font-weight: 600;
    font-size: 0.9rem;
    display: inline-block;
    border-bottom: 2px solid #C8B6A6;
    padding-bottom: 2px;
  }
`;

// Section Styling
const StyledSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #FFF8F5 0%, #FFFFFF 100%);
  overflow: hidden;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .subtitle {
    display: inline-block;
    font-size: 1rem;
    font-weight: 600;
    color: #C8B6A6;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #4A332C;
    margin-bottom: 1rem;
  }

  .title span {
    color: #C8B6A6;
    position: relative;
    display: inline-block;
  }

  .title span::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    height: 8px;
    background: rgba(200, 182, 166, 0.2);
    z-index: -1;
  }

  .description {
    font-size: 1.1rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    justify-items: center;
  }

  @media (max-width: 768px) {
    padding: 60px 0;
    
    .title {
      font-size: 2rem;
    }
    
    .cards-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (max-width: 480px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default WhyChooseUs;
