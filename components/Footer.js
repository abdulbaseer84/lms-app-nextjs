export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-2 mt-20">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-xl font-bold text-white mb-4">LMS Platform</h3>
        <div className="flex justify-center gap-8 mb-3">
          <a href="/" className="hover:text-white">Home</a>
          <a href="/about" className="hover:text-white">About Us</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </div>

        <p className="text-gray-400">
          © {new Date().getFullYear()} LMS Platform. All Rights Reserved Abdul Baseer.
        </p>
      </div>
    </footer>
  );
}
