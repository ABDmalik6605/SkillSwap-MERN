const Rating = ({ value = 0 }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          className={`text-xl transition-all ${
            star <= value 
              ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
              : 'text-slate-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
