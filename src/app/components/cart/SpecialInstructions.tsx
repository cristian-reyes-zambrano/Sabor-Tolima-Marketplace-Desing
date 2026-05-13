/**
 * SpecialInstructions — Campo premium de instrucciones para el restaurante
 * Diferenciador clave vs Rappi/Uber Eats: sugerencias rápidas + diseño premium
 */
import { useState } from 'react';
import { ChefHat, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface SpecialInstructionsProps {
  value: string;
  onChange: (v: string) => void;
  onSkip?: () => void;
}

const QUICK_SUGGESTIONS = [
  { label: 'Sin cebolla', emoji: '🧅' },
  { label: 'Poco picante', emoji: '🌶️' },
  { label: 'Extra salsa', emoji: '🥫' },
  { label: 'Sin azúcar', emoji: '🚫' },
  { label: 'Entrega rápida', emoji: '⚡' },
  { label: 'Sin cilantro', emoji: '🌿' },
  { label: 'Bien cocido', emoji: '🔥' },
  { label: 'Alérgico al maní', emoji: '⚠️' },
];

const MAX_CHARS = 250;

export function SpecialInstructions({ value, onChange, onSkip }: SpecialInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllergyWarning, setShowAllergyWarning] = useState(false);
  const remaining = MAX_CHARS - value.length;
  const hasContent = value.trim().length > 0;
  const hasAllergy = value.toLowerCase().includes('alérg') || value.toLowerCase().includes('alergi');

  const addSuggestion = (text: string) => {
    const current = value.trim();
    const newVal = current
      ? `${current}, ${text.toLowerCase()}`
      : text.toLowerCase();
    onChange(newVal.slice(0, MAX_CHARS));
    if (!isExpanded) setIsExpanded(true);
  };

  const handleChange = (text: string) => {
    onChange(text.slice(0, MAX_CHARS));
    const hasAllergyWord = text.toLowerCase().includes('alérg') || text.toLowerCase().includes('alergi');
    setShowAllergyWarning(hasAllergyWord);
  };

  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <ChefHat className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              Instrucciones para el restaurante
            </p>
            <p className="text-xs text-muted-foreground">
              {hasContent
                ? `"${value.slice(0, 40)}${value.length > 40 ? '...' : ''}"`
                : 'Sin cebolla, poco picante, alergias...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasContent && (
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
              Agregado
            </span>
          )}
          {isExpanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <CardContent className="px-4 pb-4 pt-0 space-y-3 border-t border-border/50">
          {/* Quick suggestions */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Sugerencias rápidas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map(({ label, emoji }) => {
                const isActive = value.toLowerCase().includes(label.toLowerCase());
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => isActive
                      ? onChange(value.replace(new RegExp(`,?\\s*${label.toLowerCase()}`, 'i'), '').trim())
                      : addSuggestion(label)
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-muted text-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <span>{emoji}</span>
                    {label}
                    {isActive && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <div className="relative">
              <Textarea
                placeholder="Escribe instrucciones específicas para tu pedido..."
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="rounded-xl resize-none text-sm pr-12"
                rows={3}
              />
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setShowAllergyWarning(false); }}
                  className="absolute top-2 right-2 p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-[11px] ${remaining < 30 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {remaining} caracteres restantes
              </p>
              {remaining < 30 && (
                <p className="text-[11px] text-amber-600 font-medium">Casi al límite</p>
              )}
            </div>
          </div>

          {/* Allergy warning */}
          {showAllergyWarning && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Importante:</strong> Si tienes alergias graves, te recomendamos contactar directamente al restaurante antes de ordenar.
              </p>
            </div>
          )}

          {/* Skip button */}
          {onSkip && !hasContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setIsExpanded(false); onSkip(); }}
              className="w-full text-muted-foreground hover:text-foreground text-xs rounded-xl"
            >
              No agregar instrucciones
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
