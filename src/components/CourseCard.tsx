import { BookOpen, Clock, TrendingUp, Users } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor: string;
  progress: number;
  nextClass: string;
  image: string;
  students?: number;
}

const CourseCard = ({ title, instructor, progress, nextClass, image, students = 24 }: CourseCardProps) => {
  return (
    <div className="course-card group cursor-pointer">
      {/* Background Image */}
      <div className="aspect-card w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Course Info */}
        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{instructor}</p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{nextClass}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{students}</span>
          </div>
        </div>

        {/* Hover Badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            {progress}%
          </div>
        </div>

        {/* Course Icon */}
        <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
