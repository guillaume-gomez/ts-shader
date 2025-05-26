import { ReactNode } from "react";


interface CardProps {
  children: ReactNode;
  title: string;
}

function Card({title, children} : CardProps) {
  return (
    <div className="card card-primary">
      <div className="card-title">
        {title}
      </div>
      <div className="card-body flex items-center gap-2">
        {children}
      </div>
    </div>
  )
}

export default Card;