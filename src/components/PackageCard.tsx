import React from 'react';
import AnimatedElement from './AnimatedElement';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PackageItem {
  name: string;
  price: string;
  description: string;
}

interface PackageCardProps {
  title: string;
  icon: LucideIcon;
  packages: PackageItem[];
  delay: number;
}

const PackageCard: React.FC<PackageCardProps> = ({ title, icon: Icon, packages, delay }) => {
  return (
    <AnimatedElement delay={delay} className="w-full">
      <div className="package-card flex flex-col items-center">
        <div className="mb-4 text-kiwi">
          <Icon size={40} />
        </div>
        <h3 className="text-xl font-bold text-kiwi-dark text-center mb-6">{title}</h3>
        <div className="space-y-5 w-full">
          {packages.map((pkg, index) => (
            <div key={index} className="border-t border-gray-200 pt-4">
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-sm mt-1">{pkg.description}</div>
              <div className="font-bold text-kiwi-dark mt-2">{pkg.price}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedElement>
  );
};

export default PackageCard;