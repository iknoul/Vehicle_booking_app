import React from 'react';
import styles from './styles/heroSection.module.css';
import Container from './Container';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <Container />
    </section>
  );
};

export default HeroSection;
