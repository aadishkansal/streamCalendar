import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='w-full bg-white px-4 py-8 ml-10 md:py-12'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6'>
          
          {/* Brand Section */}
          <div className='col-span-1 md:col-span-2 lg:col-span-1'>
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="items-center flex">
                  <Image
                    className=""
                    src="/streamlogo.svg"
                    alt="logo"
                    width={40}
                    height={60}
                  />
                  <Image
                    className="ml-2"
                    src="/StreamCalendar.svg"
                    alt="streamcalendar"
                    width={153}
                    height={30}
                  />
                </div>
              </Link>
              <h4 className='mt-2 text-sm text-gray-600'>Your personal schedule</h4> 
            </div>
            
            {/* Social Links */}
            <div className='flex flex-row gap-3 items-center mt-6'>
              <a href='/' className='hover:opacity-75 transition-opacity'>
                <img src="/mail.svg" alt="Email" width={30}/>
              </a>
              <a href='/' className='hover:opacity-75 transition-opacity'>
                <img src="/yt.svg" alt="YouTube" />
              </a>
              <a href='/' className='hover:opacity-75 transition-opacity'>
                <img src="/x.svg" alt="X (Twitter)" width={25} />
              </a>
            </div>
          </div>

          {/* Product Section */}
          <div className=''>
            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Product</h3>
            <div className='space-y-3'>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                Features
              </Link>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                Pricing
              </Link>
            </div>
          </div>
         
          {/* Company Section */}
          <div className=''>
            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Company</h3>
            <div className='space-y-3'>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                About
              </Link>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                Privacy Policy
              </Link>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Resources Section */}
          <div className=''>
            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Resources</h3>
            <div className='space-y-3'>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                Support
              </Link>
              <Link href="#" className='block font-medium text-base text-slate-500 hover:text-blue-600 transition-colors'>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200 mt-8 pt-6">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} StreamCalendar. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer