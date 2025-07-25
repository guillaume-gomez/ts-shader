import { ReactNode } from "react";


interface CardProps {
  children: ReactNode;
  title: string;
  className?: string;
}

function Card({title, children, className} : CardProps) {
  return (
    <div className={`card bg-base-200 p-4 gap-2 ${className}`}>
      <div className="card-title text-2xl">
        {title}
      </div>
      <div className="card-body flex items-center gap-2 bg-base-300 rounded">
        {children}
      </div>
    </div>
  )
}

export default Card;