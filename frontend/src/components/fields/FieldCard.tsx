import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Field } from '@/data/fieldsData';
import { fieldImages } from '@/data/fieldImages';

interface FieldCardProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
  animationDelay: string;
}

export function FieldCard({ field, isSelected, onClick, animationDelay }: FieldCardProps) {
  const FieldIcon = field.icon;
  const backgroundImage = fieldImages[field.id];

  return (
    <button
      onClick={onClick}
      className={`relative group p-5 bg-card rounded-xl border transition-all duration-300 text-left animate-slide-up overflow-hidden ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-lg'
          : 'border-border hover:border-primary/50 hover:shadow-lg'
      }`}
      style={{ animationDelay }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/65 group-hover:to-black/45" />
      
      {/* Content */}
      <div className="relative z-10">
        {isSelected && (
          <div className="absolute top-0 right-0">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        )}
        
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${field.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
          <FieldIcon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1 pr-6">{field.name}</h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{field.description}</p>
        
        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-gray-400">Demand: </span>
            <span className="font-medium text-white">{field.demand}</span>
          </div>
          <div>
            <span className="text-gray-400">Growth: </span>
            <span className="font-medium text-green-400">{field.growth}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-medium">Select & Continue</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}
