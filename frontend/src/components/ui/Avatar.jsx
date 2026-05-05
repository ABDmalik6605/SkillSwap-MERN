const Avatar = ({ src, name }) => (
  <div className="flex items-center gap-2">
    <img
      src={src || 'https://placehold.co/48x48'}
      alt={name}
      className="w-12 h-12 rounded-full object-cover"
    />
    <span className="font-semibold">{name}</span>
  </div>
);

export default Avatar;
