import React from 'react';
import * as Icons from 'lucide-react';

interface MoodIconProps {
  name: string;
  className?: string;
  size?: number;
  id?: string;
  style?: React.CSSProperties;
}

export const MoodIcon: React.FC<MoodIconProps> = ({ name, className = '', size = 24, id, style }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // Return HelpCircle as a reliable fallback
    const Fallback = Icons.HelpCircle;
    return <Fallback id={id} className={className} size={size} style={style} />;
  }
  return <IconComponent id={id} className={className} size={size} style={style} />;
};