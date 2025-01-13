export default function Navbar() {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Brand</h1>
          <ul className="flex space-x-4">
            <li><a href="#about" className="hover:text-gray-400">About</a></li>
            <li><a href="#testimonials" className="hover:text-gray-400">Testimonials</a></li>
            <li><a href="#contact" className="hover:text-gray-400">Contact</a></li>
            <li><a href="/login" className="hover:text-gray-400">Login</a></li>
            <li><a href="/signup" className="hover:text-gray-400">Signup</a></li>
          </ul>
        </div>
      </nav>
    );
  }
  