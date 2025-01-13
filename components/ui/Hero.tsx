export default function Hero() {
    return (
      <section className="bg-cover bg-center h-screen text-center flex flex-col justify-center items-center text-white" style={{ backgroundImage: 'url(https://source.unsplash.com/random)' }}>
        <h1 className="text-5xl font-bold">Welcome to Our Landing Page</h1>
        <p className="text-2xl mt-4">A simple solution for your business.</p>
        <a href="#about" className="mt-6 px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-700">Learn More</a>
      </section>
    );
  }
  