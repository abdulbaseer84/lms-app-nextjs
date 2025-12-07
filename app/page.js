export default function Home() {
  return (
    <div className="bg-gray-50">

      {/* HERO SECTION */}
      <section className="px-6 pt-28 pb-24 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center"
        data-aos="fade-down"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" data-aos="zoom-in">
          Learn Without Limits
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto" data-aos="fade-up">
          Build in-demand skills with world-class instructors and real projects.
        </p>

        {/* Search Bar */}
        <div
          className="max-w-xl mx-auto mt-8 flex items-center shadow-lg rounded-lg overflow-hidden bg-white"
          data-aos="fade-up"
        >
          <input
            placeholder="Search for a course..."
            className="flex-1 px-4 py-3 text-gray-700 outline-none"
          />
          <button className="bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700">
            Search
          </button>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center gap-4" data-aos="zoom-in-up">
          <a
            href="/auth/register"
            className="bg-yellow-300 text-blue-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition"
          >
            Get Started
          </a>
          <a
            href="/courses"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Browse Courses
          </a>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {["Web Development", "AI & ML", "Data Science", "Cloud", "Python", "Java", "UI/UX", "Cyber Security"].map(
            (cat, index) => (
              <div
                key={cat}
                className="p-6 bg-white shadow hover:shadow-lg rounded-lg text-center font-semibold text-gray-700 cursor-pointer transition"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                {cat}
              </div>
            )
          )}
        </div>
      </section>

      {/* TRENDING COURSES */}
      <section className="px-6 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
          Trending Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[1, 2, 3].map((item, index) => (
            <div
              key={item}
              className="bg-gray-100 rounded-xl shadow hover:shadow-xl transition overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <div className="h-40 bg-blue-300" />
              <div className="p-6">
                <h3 className="font-bold text-xl">Full Stack MERN Development</h3>
                <p className="text-gray-600 mt-2">
                  Master MongoDB, Express, React & Node.js from scratch.
                </p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-white shadow rounded-lg text-center" data-aos="flip-left">
            <h3 className="text-xl font-bold mb-3">Expert Instructors</h3>
            <p className="text-gray-600">Learn from real industry professionals.</p>
          </div>

          <div className="p-8 bg-white shadow rounded-lg text-center" data-aos="flip-up">
            <h3 className="text-xl font-bold mb-3">Hands-on Projects</h3>
            <p className="text-gray-600">Practice with assignments and real-world tasks.</p>
          </div>

          <div className="p-8 bg-white shadow rounded-lg text-center" data-aos="flip-right">
            <h3 className="text-xl font-bold mb-3">Flexible Learning</h3>
            <p className="text-gray-600">Learn at your pace anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10" data-aos="fade-up">
          What Our Students Say
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div
            className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition"
            data-aos="zoom-in"
          >
            <p className="text-gray-700">"Best platform ever! I improved my skills and got placed."</p>
            <h4 className="font-bold mt-4">– Abdul Baseer</h4>
          </div>

          <div
            className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <p className="text-gray-700">"Amazing instructors and well-structured content."</p>
            <h4 className="font-bold mt-4">– Abdul Baseer</h4>
          </div>
        </div>
      </section>

    </div>
  );
}
