import React from 'react'

import HeroSection from './HeroSection.jsx';
import iphone from '../../assets/iphone-14-pro.webp';
import mac from '../../assets/mac-system-cut.jfif'
import FeaturedProducts from './FeaturedProducts';

const HomePage = () => {
    return (
        <div>
            <HeroSection 
                title="Buy iPhone 14 pro" 
                subtitle="Experience the power of the latest iPhone 14 with our most Pro camera ever."
                link="/product/682f94f93f8bba672a6191c0"
                image={iphone}
            />

            <FeaturedProducts />

            <HeroSection 
                title="Build the ultimate setup" 
                subtitle="You can add Studio Display and colour-matched Magic accessories to your bag after configuring your Mac mini."
                link="/product/682f94f93f8bba672a6191c8"
                image={mac}
            />
        </div>
    )
}

export default HomePage
