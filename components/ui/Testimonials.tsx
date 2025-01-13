export default function Testimonials() {
    const testimonials = [
      { name: 'John Doe', text: "This product changed my life!" },
      { name: 'Jane Smith', text: "An amazing experience, I'd highly recommend it!" }, // example with single quote
      { name: 'Michael Johnson', text: 'Excellent customer service and fantastic quality.' },
    ];
  
    return (
      <section id="testimonials" className="py-16 text-center bg-white">
        <h2 className="text-4xl font-bold mb-4">What People Are Saying</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 shadow-lg rounded-lg">
              <p className="text-gray-700 mb-4">
                &quot;{testimonial.text.replace("'", "&apos;")}&quot;
              </p>
              <h3 className="font-bold text-xl">{testimonial.name}</h3>
            </div>
          ))}
        </div>
      </section>
    );
}
