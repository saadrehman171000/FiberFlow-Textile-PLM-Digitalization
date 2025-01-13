export default function ContactForm() {
    return (
      <section id="contact" className="py-16 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-8">Get In Touch</h2>
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <input type="text" placeholder="Name" className="w-full p-4 border border-gray-300 rounded-md" />
            <input type="email" placeholder="Email" className="w-full p-4 border border-gray-300 rounded-md" />
            <textarea placeholder="Message" rows={5} className="w-full p-4 border border-gray-300 rounded-md"></textarea>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">Send Message</button>
          </form>
        </div>
      </section>
    );
  }
  