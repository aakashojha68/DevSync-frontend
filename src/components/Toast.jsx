import { X } from "lucide-react";
import { useEffect, useState } from "react";

const Toast = ({ message, isError, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Slide in
    setShow(true);

    // Auto-close after 500ms
    const timer = setTimeout(() => handleClose(), 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);

    // Wait for animation to finish
    setTimeout(() => {
      onClose?.();
    }, 300); // animation duration
  };

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 
        flex items-center gap-3 min-w-[250px]
        ${
          isError ? "bg-red-700" : "bg-green-900"
        } text-white px-4 py-3 rounded-lg shadow-lg
        transition-transform duration-300 ease-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <span className="flex-1 font-medium">{message}</span>

      <button onClick={handleClose}>
        <X className="w-5 h-5 hover:text-red-400 transition-colors" />
      </button>
    </div>
  );
};

export default Toast;
