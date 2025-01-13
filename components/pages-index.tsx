'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, MessageCircle, Users, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image src="https://i.imgur.com/8OgCsqA.png" alt="FiberFlow Logo" width={40} height={40} />
                <span className="ml-2 text-2xl font-bold text-gray-900">FiberFlow</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="#about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </Link>
              <Link href="#features" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Features
              </Link>
              <Link href="#testimonials" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Testimonials
              </Link>
              <Link href="#contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="outline" className="mr-2" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block xl:inline">Digitalizing the</span>{' '}
                  <span className="block text-blue-600 xl:inline">Textile Industry</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Enhancing Product Lifecycle Management with real-time transparency, innovation, and automation.
                </motion.p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button size="lg" asChild>
                      <Link href="/signup">
                        Get started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button size="lg" variant="outline" asChild>
                      <Link href="#about">Learn more</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Textile factory"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">About FiberFlow</h2>
            <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Revolutionizing Textile PLM
            </p>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500 lg:mx-auto">
              FiberFlow is a cutting-edge platform designed to transform the textile industry&apos;s Product Lifecycle Management (PLM) processes. Our mission is to empower businesses with innovative tools that streamline operations, enhance collaboration, and drive sustainable growth in the ever-evolving textile sector.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-md bg-blue-500 text-white mx-auto">
                  <Zap className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Innovative Technology</h3>
                <p className="mt-2 text-base text-gray-500">
                  Leveraging AI and machine learning to provide cutting-edge solutions for the textile industry.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-md bg-blue-500 text-white mx-auto">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Collaborative Platform</h3>
                <p className="mt-2 text-base text-gray-500">
                  Facilitating seamless communication and collaboration between all stakeholders in the textile supply chain.
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-md bg-blue-500 text-white mx-auto">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Sustainability Focus</h3>
                <p className="mt-2 text-base text-gray-500">
                  Promoting eco-friendly practices and transparency in the textile production process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Real-time Updates',
                description: 'Get instant notifications and updates on your textile production process.',
                icon: CheckCircle,
              },
              {
                name: 'Fabric Defect Detection',
                description: 'Advanced AI algorithms to detect and report fabric defects in real-time.',
                icon: Users,
              },
              {
                name: 'Innovative Marketplace',
                description: 'Connect buyers and sellers efficiently in our digital textile marketplace.',
                icon: MessageCircle,
              },
              {
                name: 'Sustainability Tracking',
                description: 'Monitor and improve the environmental impact of your textile production.',
                icon: Zap,
              },
            ].map((feature) => (
              <Card key={feature.name}>
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-base text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                quote: "FiberFlow has revolutionized our textile operations. The real-time updates and defect detection have significantly improved our production efficiency.",
                author: "Textile Corp",
              },
              {
                quote: "The PLM digitalization from FiberFlow helped us streamline communication with suppliers and reduce lead times by 30%.",
                author: "Global Textiles",
              },
              {
                quote: "An excellent platform with a user-friendly interface and exceptional support from the FiberFlow team.",
                author: "FashionTech",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <p className="font-semibold text-gray-900">- {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
              Contact Us
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <Input id="name" name="name" type="text" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <Textarea id="message" name="message" rows={4} required className="mt-1" />
              </div>
              <div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Image src="https://i.imgur.com/8OgCsqA.png" alt="FiberFlow Logo" width={40} height={40} />
              <p className="mt-4 text-base text-gray-300">
                Digitalizing the textile industry with innovative PLM solutions.
              </p>
              <div className="flex space-x-6 mt-4">
                {['facebook', 'twitter', 'linkedin'].map((item) => (
                  <a key={item} href="#" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">{item}</span>
                    <Image src={`https://i.imgur.com/${item}-icon.png`} alt={item} width={24} height={24} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Solutions</h3>
              <ul className="mt-4 space-y-4">
                {['PLM', 'Fabric Detection', 'Marketplace', 'Analytics'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-4">
                {['Pricing', 'Documentation', 'Guides', 'API Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2024 FiberFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}