const Footer = () => {
  return (
    <footer className="bg-red-900 h-20 mt-auto py-4 px-2 text-center text-sm text-red-50 border-t flex flex-col justify-center items-center">
      <p>
        © {new Date().getFullYear()} BookVerse · Made with 💙 by Kajal Verma
      </p>
      <p className="text-xs mt-1">Browse · Read · Review</p>
    </footer>
  );
};

export default Footer;

