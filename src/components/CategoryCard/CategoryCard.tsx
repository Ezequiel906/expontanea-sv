import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./CategoryCard.css";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

function CategoryCard({
  title,
  description,
  image,
  href,
}: CategoryCardProps) {
  return (
    <Link to={href} className="category-card">
      <img src={image} alt={title} className="category-card-image" />

      <div className="category-card-overlay">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <span className="category-card-icon">
          <ArrowUpRight size={20} strokeWidth={1.8} />
        </span>
      </div>
    </Link>    
  );
}

export default CategoryCard;