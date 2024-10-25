// client/src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Clock, ShoppingBag, Utensils } from 'lucide-react';

export default function HomePage() {
  const { translate } = useLanguage();

  const features = [
    {
      icon: Clock,
      title: translate('Quick & Easy'),
      description: translate('Order ahead and skip the line'),
    },
    {
      icon: Utensils,
      title: translate('Fresh & Delicious'),
      description: translate('Made fresh daily with quality ingredients'),
    },
    {
      icon: ShoppingBag,
      title: translate('Convenient Pickup'),
      description: translate('Ready when you are'),
    },
  ];

  const popularItems = [
    {
      name: translate('Orange Chicken'),
      image: '/images/orange-chicken.jpg',
      price: 11.99,
    },
    {
      name: translate('Beijing Beef'),
      image: '/images/beijing-beef.jpg',
      price: 12.99,
    },
    {
      name: translate('Chow Mein'),
      image: '/images/chow-mein.jpg',
      price: 4.99,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-black">
        <Image
          src="/images/hero-image.jpg"
          alt="Delicious Panda Express Food"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {translate('Welcome to Panda Express')}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {translate('Experience the bold flavors of American Chinese cuisine')}
          </p>
          <Link
            href="/menu"
            className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
          >
            <span>{translate('Start Your Order')}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-[var(--panda-red)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translate('Popular Items')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-[var(--panda-red)] font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/menu" className="btn-primary inline-flex items-center space-x-2">
              <span>{translate('View Full Menu')}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => document.documentElement.classList.toggle('text-lg')}
            className="mx-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {translate('Increase Text Size')}
          </button>
          <button
            onClick={() => document.documentElement.classList.toggle('high-contrast')}
            className="mx-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {translate('High Contrast')}
          </button>
        </div>
      </div>
    </div>
  );
}