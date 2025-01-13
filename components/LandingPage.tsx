'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, MessageCircle, Users, Zap, Sun, Moon, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { SignedOut, UserButton, SignedIn } from '@clerk/nextjs'

export default function LandingPage() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {/* Navbar */}
                <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 0 ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center space-x-2">
                                <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-2xl font-bold">FiberFlow</span>
                            </Link>
                            <div className="hidden md:flex items-center space-x-6">
                                {['About', 'Features', 'Testimonials', 'Contact'].map((item) => (
                                    <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                                        {item}
                                    </Link>
                                ))}
                                <Switch
                                    checked={isDarkMode}
                                    onCheckedChange={toggleDarkMode}
                                    className="bg-gray-200 dark:bg-gray-700"
                                />
                                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <SignedIn>
                                    <Link href={"/user-dashboard"}>
                                        <Button>Dashboard</Button>
                                    </Link>
                                    <UserButton />

                                </SignedIn>
                                <SignedOut>
                                    <Button variant="outline" asChild>
                                        <Link href="/sign-in">Login</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/sign-up">Sign Up</Link>
                                    </Button>
                                </SignedOut>
                            </div>
                            <button className="md:hidden" onClick={toggleMenu}>
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed inset-0 z-40 bg-white dark:bg-gray-800 pt-16"
                        >
                            <div className="container mx-auto px-4 py-8">
                                <div className="flex flex-col space-y-4">
                                    {['About', 'Features', 'Testimonials', 'Contact'].map((item) => (
                                        <Link key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                                            {item}
                                        </Link>
                                    ))}
                                    <div className="flex items-center space-x-4">
                                        <Switch
                                            checked={isDarkMode}
                                            onCheckedChange={toggleDarkMode}
                                            className="bg-gray-200 dark:bg-gray-700"
                                        />
                                        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                    </div>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                            <motion.div
                                className="text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                    <span className="block">Digitalizing the</span>
                                    <span className="block text-blue-600 dark:text-blue-400">Textile Industry</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl">
                                    Enhancing Product Lifecycle Management with real-time transparency, innovation, and automation.
                                </p>
                                <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <Button size="lg" className="w-full sm:w-auto" asChild>
                                        <Link href="/signup">
                                            Get started
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto" asChild>
                                        <Link href="#about">Learn more</Link>
                                    </Button>
                                </div>
                            </motion.div>
                            <motion.div
                                className="mt-12 relative lg:mt-0 lg:col-span-6"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                                    <div className="relative block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                                            alt="Textile factory"
                                            width={2070}
                                            height={1380}
                                            className="w-full"
                                        />
                                        <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-30"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="h-20 w-20 text-blue-500" fill="currentColor" viewBox="0 0 84 84">
                                                <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                                                <path d="M55.5039 40.3359L37.1094 28.0729C35.7803 27.1869 34 28.1396 34 29.737V54.263C34 55.8604 35.7803 56.8131 37.1094 55.9271L55.5038 43.6641C56.6913 42.8725 56.6913 41.1275 55.5039 40.3359Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">About FiberFlow</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
                                Revolutionizing Textile PLM
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                                FiberFlow is a cutting-edge platform designed to transform the textile industry&#39;s Product Lifecycle Management (PLM) processes. Our mission is to empower businesses with innovative tools that streamline operations, enhance collaboration, and drive sustainable growth in the ever-evolving textile sector.
                            </p>
                        </div>

                        <div className="mt-20">
                            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                {[
                                    {
                                        name: 'Innovative Technology',
                                        description: 'Leveraging AI and machine learning to provide cutting-edge solutions for the textile industry.',
                                        icon: Zap,
                                    },
                                    {
                                        name: 'Collaborative Platform',
                                        description: 'Facilitating seamless communication and collaboration between all stakeholders in the textile supply chain.',
                                        icon: Users,
                                    },
                                    {
                                        name: 'Sustainability Focus',
                                        description: 'Promoting eco-friendly practices and transparency in the textile production process.',
                                        icon: CheckCircle,
                                    },
                                    {
                                        name: 'Real-time Analytics',
                                        description: 'Providing instant insights and data-driven decision making capabilities.',
                                        icon: MessageCircle,
                                    },
                                ].map((feature) => (
                                    <div key={feature.name} className="relative">
                                        <dt>
                                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                                <feature.icon className="h-6 w-6" aria-hidden="true" />
                                            </div>
                                            <p className="ml-16 text-lg leading-6 font-medium">{feature.name}</p>
                                        </dt>
                                        <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">{feature.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
                                Everything you need to manage your textile production
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                                FiberFlow provides a comprehensive suite of tools to streamline your textile production process from start to finish.
                            </p>
                        </div>

                        <div className="mt-20">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { name: 'Real-time Updates', description: 'Get instant notifications and updates on your textile production process.', icon: CheckCircle },
                                    { name: 'Fabric Defect Detection', description: 'Advanced AI algorithms to detect and report fabric defects in real-time.', icon: Users },
                                    { name: 'Innovative Marketplace', description: 'Connect buyers and sellers efficiently in our digital textile marketplace.', icon: MessageCircle },
                                    { name: 'Sustainability Tracking', description: 'Monitor and improve the environmental impact of your textile production.', icon: Zap },
                                    { name: 'Supply Chain Management', description: 'Streamline your supply chain with our integrated management tools.', icon: ArrowRight },
                                    { name: 'Quality Control', description: 'Ensure consistent quality with our advanced quality control features.', icon: CheckCircle },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={feature.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card className="h-full transition-transform duration-300 hover:scale-105">
                                            <CardContent className="p-6 flex flex-col h-full">
                                                <feature.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                                                <h3 className="text-lg font-medium mb-2">{feature.name}</h3>
                                                <p className="text-base text-gray-500 dark:text-gray-400 flex-grow">{feature.description}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-center mb-12">
                            What Our Clients Say
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                { quote: "FiberFlow has revolutionized our textile operations. The real-time updates and defect detection have significantly improved our production efficiency.", author: "Textile Corp", role: "CEO" },
                                { quote: "The PLM digitalization from FiberFlow helped us streamline communication with suppliers and reduce lead times by 30%.", author: "Global Textiles", role: "Operations Manager" },
                                { quote: "An excellent platform with a user-friendly interface and exceptional support from the FiberFlow team.", author: "FashionTech", role: "Lead Designer" },
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full transition-transform duration-300 hover:scale-105">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <div className="flex-grow">
                                                <svg className="h-8 w-8 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 32 32">
                                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                                </svg>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.quote}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <Image className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/40?img=${index}`} alt="" width={40} height={40} />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium">{testimonial.author}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-lg mx-auto">
                            <h2 className="text-3xl font-extrabold text-center mb-8">
                                Contact Us
                            </h2>
                            <motion.form
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Your Name
                                    </label>
                                    <Input id="name" name="name" type="text" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Your Email
                                    </label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                                        Your Message
                                    </label>
                                    <Textarea id="message" name="message" rows={4} required />
                                </div>
                                <div>
                                    <Button type="submit" className="w-full">
                                        Send Message
                                    </Button>
                                </div>
                            </motion.form>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 dark:bg-gray-900 text-white transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center space-x-2">
                                    <svg className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-2xl font-bold">FiberFlow</span>
                                </div>
                                <p className="mt-4 text-base text-gray-300">
                                    Digitalizing the textile industry with innovative PLM solutions.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
                                <ul className="mt-4 space-y-2">
                                    {['About', 'Features', 'Testimonials', 'Contact'].map((item) => (
                                        <li key={item}>
                                            <Link href={`#${item.toLowerCase()}`} className="text-base text-gray-300 hover:text-white transition-colors duration-300">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider">Account</h3>
                                <ul className="mt-4 space-y-2">
                                    <li>
                                        <Link href="/login" className="text-base text-gray-300 hover:text-white transition-colors duration-300">
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/signup" className="text-base text-gray-300 hover:text-white transition-colors duration-300">
                                            Sign Up
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-base text-gray-400">
                                &copy; 2024 FiberFlow. All rights reserved.
                            </p>
                            <div className="mt-4 md:mt-0 flex space-x-6">
                                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
