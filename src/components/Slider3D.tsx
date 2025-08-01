import React from 'react';
interface Slider3DProps {
  images: string[];
  title?: string;
  subtitle?: string;
  author?: string;
}
const Slider3D: React.FC<Slider3DProps> = ({
  images,
  title = "PAINTBALL",
  subtitle = "ADVENTURE",
  author = "Experience the thrill of tactical combat in our premium paintball arenas"
}) => {
  return <div className="slider-3d-banner">
      <div className="slider-3d-container" style={{
      '--quantity': images.length
    } as React.CSSProperties}>
        {images.map((image, index) => <div key={index} className="slider-3d-item" style={{
        '--position': index + 1
      } as React.CSSProperties}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>)}
      </div>
      
      <div className="slider-3d-content">
        
        
      </div>
      
      
      {/* Logo positioned below slider on desktop */}
      <div className="hidden md:flex justify-center mt-64">
        <img src="https://i.imgur.com/AFAnlxO.png" alt="Paintball Adventure Logo" className="h-72 w-auto object-contain mx-auto" />
      </div>
    </div>;
};
export default Slider3D;