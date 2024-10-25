import React from 'react';
import styles from './styles/ctaSection.module.css';
import Image from 'next/image';
import car1 from '@/../public/asset/landingPage/info_block_img1.svg'
import car2 from '@/../public/asset/landingPage/info_block_img2.svg'
import Link from 'next/link';

const CtaSection = () => {
	

  return (
    <section className={styles.cta}>
      <div className={styles.ctaItem}>
        <div className={styles.ctaContent}>
          <h2>
            WE OFFER YOU AN EXCLUSIVE, <br/>EXECUTIVE EXPERIENCE 
          </h2>
          <h3>
            WITH THE MOST <br />SUITABLE RATES <br />AND EXCEPTIONAL <br />SERVICE
          </h3>
        </div>
        <div className={styles.ctaImage}>
          <Image
            src={car1}
            alt='cta car 1 image'
          />
        </div>
      </div>

      <div className={styles.ctaItem}>
        <div className={styles.ctaImage2}>
          <Image
            src={car2}
            alt='car 2'
          />
        </div>
        <div className={styles.ctaContent}>  
          <p>
            <span>TRUSTED, PREMIUM SERVICE with PREMIUM NEW CARS.<br /></span>
            When it comes to choosing an excotic car we provide you with
            first class service. FLORIDA PREMIUM LIMO provides exceptional
            customer service and cost-effective on the finest quality, and
            elite brand fleet. We offer appropriate prices on all Premium cars.
          </p>
          <Link href='/Registration'>
            SIGN UP
          </Link>
          <Link href='/Login'>
            LOG IN
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default CtaSection;
