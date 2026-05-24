function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
