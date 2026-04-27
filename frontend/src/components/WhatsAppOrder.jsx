import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MessageCircle, Send, CheckCircle, Clock, Cake, Heart } from 'lucide-react';

const WhatsAppOrder = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleWhatsAppClick = () => {
        // Pre-filled message
        const defaultMessage = "Hi LoveBakes! 👋 I'd like to place an order for:";
        const encodedMessage = encodeURIComponent(defaultMessage);

        // Your WhatsApp number (replace with your actual number)
        const yourNumber = "918144622958"; // Format: country code + number, no + or spaces

        window.open(`https://wa.me/${yourNumber}?text=${encodedMessage}`, '_blank');
    };

    const handleQuickOrder = (cakeName) => {
        const quickMessage = `Hi LoveBakes! 👋 I'd like to order ${cakeName}. Can you please share the details and availability?`;
        const encodedMessage = encodeURIComponent(quickMessage);
        const yourNumber = "918144622958";

        window.open(`https://wa.me/${yourNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <StyledSection>
            <div className="container">
                {/* Decorative elements */}
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>

                <div className="content-wrapper">
                    {/* Left side - Main CTA */}
                    <motion.div
                        className="left-content"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="badge">
                            <MessageCircle className="badge-icon" size={16} />
                            <span>Quick & Easy</span>
                        </div>

                        <h2 className="title">
                            Order Directly on
                            <span className="highlight">
                                <span className="whatsapp-text"> WhatsApp</span>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                    alt="WhatsApp"
                                    className="whatsapp-icon"
                                />
                            </span>
                        </h2>

                        <p className="description">
                            Prefer to chat? We're just a message away! 🫶
                        </p>

                        <div className="features">
                            <div className="feature">
                                <div className="feature-icon green-bg">
                                    <MessageCircle size={18} />
                                </div>
                                <span>Quick replies within 5 mins</span>
                            </div>
                            <div className="feature">
                                <div className="feature-icon green-bg">
                                    <Send size={18} />
                                </div>
                                <span>Share photos of your dream cake</span>
                            </div>
                            <div className="feature">
                                <div className="feature-icon green-bg">
                                    <Clock size={18} />
                                </div>
                                <span>Order anytime, 24/7</span>
                            </div>
                        </div>

                        <motion.button
                            className="whatsapp-button"
                            onClick={handleWhatsAppClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageCircle size={24} />
                            <span>Start Chat on WhatsApp</span>
                            <Send size={18} className="send-icon" />
                        </motion.button>

                        <p className="small-note">
                            👋 We personally handle all orders. No bots, just real bakers!
                        </p>
                    </motion.div>

                    {/* Right side - Quick order cards */}
                    <motion.div
                        className="right-content"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="quick-order-header">
                            <h3>Quick Order</h3>
                            <p>Tap to order popular items</p>
                        </div>

                        <div className="quick-order-grid">
                            {[
                                { name: "Chocolate Cake", emoji: "🍫", price: "₹599" },
                                { name: "Pineapple Cake", emoji: "🍍", price: "₹549" },
                                { name: "Cupcakes (6 pcs)", emoji: "🧁", price: "₹299" },
                                { name: "Black Forest", emoji: "🍒", price: "₹699" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="quick-order-card"
                                    onClick={() => handleQuickOrder(item.name)}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    viewport={{ once: true }}
                                >
                                    <span className="item-emoji">{item.emoji}</span>
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">{item.price}</span>
                                    </div>
                                    <MessageCircle size={16} className="item-whatsapp" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="testimonial-note">
                            <Heart size={14} className="heart-icon" />
                            <span>Join 50+ happy customers who ordered via WhatsApp!</span>
                        </div>
                    </motion.div>
                </div>

                {/* Stats banner */}
                <motion.div
                    className="stats-banner"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="stat-item">
                        <span className="stat-number">5 min</span>
                        <span className="stat-label">Avg. reply time</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Order anytime</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Personal chat</span>
                    </div>
                </motion.div>

                {/* Small note about business hours */}
                <div className="business-hours">
                    <Clock size={14} />
                    <span>We're active 9 AM - 9 PM (orders after hours are replied next morning)</span>
                </div>
            </div>
        </StyledSection>
    );
};

const StyledSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%);
  position: relative;
  overflow: hidden;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 2;
  }

  /* Decorative blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    z-index: 1;
  }

  .blob-1 {
    width: 300px;
    height: 300px;
    background: rgba(37, 211, 102, 0.1);
    top: -100px;
    right: -100px;
  }

  .blob-2 {
    width: 250px;
    height: 250px;
    background: rgba(37, 211, 102, 0.1);
    bottom: -50px;
    left: -50px;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-bottom: 40px;
    position: relative;
    z-index: 2;
  }

  /* Left content styles */
  .left-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(37, 211, 102, 0.1);
    color: #075e54;
    padding: 8px 16px;
    border-radius: 40px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 24px;
    border: 1px solid rgba(37, 211, 102, 0.2);
  }

  .badge-icon {
    color: #25D366;
  }

  .title {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 20px;
    color: #1a1a1a;
  }

  .highlight {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #25D366, #128C7E);
    padding: 4px 16px 4px 20px;
    border-radius: 50px;
    margin-left: 8px;
  }

  .whatsapp-text {
    color: white;
  }

  .whatsapp-icon {
    width: 28px;
    height: 28px;
    filter: brightness(0) invert(1);
  }

  .description {
    font-size: 1.2rem;
    color: #4a4a4a;
    line-height: 1.6;
    margin-bottom: 30px;
    max-width: 90%;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 30px;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .feature-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .green-bg {
    background: #25D366;
  }

  .whatsapp-button {
    background: #25D366;
    color: white;
    border: none;
    padding: 18px 32px;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    box-shadow: 0 20px 30px -10px rgba(37, 211, 102, 0.3);
    margin-bottom: 16px;
    transition: background 0.3s ease;

    &:hover {
      background: #128C7E;
    }
  }

  .send-icon {
    margin-left: 4px;
  }

  .send-icon {
    margin-left: 4px;
  }

  .small-note {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }

  /* Right content styles */
  .right-content {
    background: white;
    border-radius: 30px;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  .quick-order-header {
    margin-bottom: 24px;

    h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    p {
      color: #666;
      font-size: 0.95rem;
    }
  }

  .quick-order-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .quick-order-card {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
      border-color: #25D366;
      background: white;
    }

    .item-emoji {
      font-size: 2rem;
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 0.95rem;
    }

    .item-price {
      font-size: 0.85rem;
      color: #25D366;
      font-weight: 600;
    }

    .item-whatsapp {
      color: #25D366;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    &:hover .item-whatsapp {
      opacity: 1;
    }
  }

  .testimonial-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: #f0f8f0;
    border-radius: 30px;
    color: #075e54;
    font-size: 0.9rem;

    .heart-icon {
      color: #ff4d4d;
    }
  }

  /* Stats banner */
  .stats-banner {
    background: white;
    border-radius: 60px;
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 40px 0 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(37, 211, 102, 0.1);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #25D366;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
  }

  .divider {
    width: 1px;
    height: 40px;
    background: #e0e0e0;
  }

  .business-hours {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #666;
    font-size: 0.9rem;
    margin-top: 16px;

    svg {
      color: #25D366;
    }
  }

  /* Responsive styles */
  @media (max-width: 968px) {
    .content-wrapper {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .title {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 768px) {
    padding: 60px 0;

    .title {
      font-size: 2rem;
    }

    .quick-order-grid {
      grid-template-columns: 1fr;
    }

    .stats-banner {
      flex-direction: column;
      gap: 20px;
      border-radius: 30px;
      padding: 20px;
    }

    .divider {
      width: 80%;
      height: 1px;
    }
  }
`;

export default WhatsAppOrder;
