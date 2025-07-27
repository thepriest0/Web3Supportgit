import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { SupportCategory } from '@/lib/support-categories';
import { cn } from '@/lib/utils';

interface SupportCategoryCardProps {
  category: SupportCategory;
}

export function SupportCategoryCard({ category }: SupportCategoryCardProps) {
  const [, setLocation] = useLocation();
  const Icon = category.icon;

  const handleClick = () => {
    setLocation(`/issue/${category.slug}`);
  };

  return (
    <Card 
      className="cursor-pointer group web3-hover-shadow transition-all duration-200 hover:border-blue-300"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            category.bgColor
          )}>
            <Icon className={cn("w-6 h-6", category.color)} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {category.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {category.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
