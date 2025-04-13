
import { Link } from 'react-router-dom';
import { CalendarClock, Target, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const CampaignCard = ({ campaign }) => {
  const { 
    _id, 
    title, 
    description, 
    imageUrl, 
    category,
    goalAmount, 
    raisedAmount, 
    daysLeft,
    backers,
    createdAt
  } = campaign;
  
  // Calculate progress percentage
  const progress = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);
  
  // Format date
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="campaign-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || '/placeholder.svg'} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 m-3">
          <Badge variant="secondary" className="font-medium">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">
          <Link to={`/campaign/${_id}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {description}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4 mb-3">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-semibold">${raisedAmount.toLocaleString()}</span>
            <span className="text-gray-500">
              {progress}% of ${goalAmount.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Campaign Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <CalendarClock size={16} />
            <span>{daysLeft} days left</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{backers} backers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target size={16} />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
