import React from 'react';
import * as Icons from 'lucide-react';

interface MoodIconProps {
  name: string;
  className?: string;
  size?: number;
  id?: string;
}

export const MoodIcon: React.FC<MoodIconProps> = ({ name, className = '', size = 24, id }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // Return HelpCircle as a reliable fallback
    const Fallback = Icons.HelpCircle;
    return <Fallback id={id} className={className} size={size} />;
  }
  return <IconComponent id={id} className={className} size={size} />;
};
