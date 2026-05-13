import { Beef, Pizza, Salad, Coffee, Crown, Sparkles } from 'lucide-react';
import type { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const CATEGORIES = [
  {
    id: 'tipica' as Category,
    label: 'Típica',
    emoji: '🍲',
    icon: Beef,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    activeBg: 'bg-orange-600',
  },
  {
    id: 'rapida' as Category,
    label: 'Rápida',
    emoji: '🍔',
    icon: Pizza,
    color: 'text-red-600',
    bg: 'bg-red-100',
    activeBg: 'bg-red-600',
  },
  {
    id: 'saludable' as Category,
    label: 'Saludable',
    emoji: '🥗',
    icon: Salad,
    color: 'text-green-600',
    bg: 'bg-green-100',
    activeBg: 'bg-green-600',
  },
  {
    id: 'cafeteria' as Category,
    label: 'Cafetería',
    emoji: '☕',
    icon: Coffee,
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    activeBg: 'bg-amber-700',
  },
  {
    id: 'gourmet' as Category,
    label: 'Gourmet',
    emoji: '✨',
    icon: Crown,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    activeBg: 'bg-purple-600',
  },
  {
    id: 'ofertas' as Category,
    label: 'Ofertas',
    emoji: '🔥',
    icon: Sparkles,
    color: 'text-pink-600',
    bg: 'bg-pink-100',
    activeBg: 'bg-pink-600',
  },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const toggle = (id: Category) => {
    onSelectCategory(selectedCategory === id ? null : id);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-foreground">Categorías</h2>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-transparent bg-white hover:border-border hover:shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isSelected ? `${cat.activeBg} shadow-md` : cat.bg
                }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isSelected ? 'text-white' : cat.color
                  }`}
                />
              </div>
              <span
                className={`text-xs font-semibold transition-colors ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
