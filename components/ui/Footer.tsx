export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 FiberFlow. All rights reserved.</p>
          <div className="mt-4">
            <a href="#about" className="text-gray-400 hover:text-white mx-2">About</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white mx-2">Testimonials</a>
            <a href="#contact" className="text-gray-400 hover:text-white mx-2">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  