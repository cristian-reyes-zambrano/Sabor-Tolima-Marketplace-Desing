import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Store, MapPin, Clock, Phone, ChevronRight, ChevronLeft,
  Upload, X, CheckCircle2, Loader2, ImagePlus, FileText,
  DollarSign, Utensils,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuthStore } from '../store/useAuthStore';
import { useSellerStore } from '../store/useSellerStore';
import { uploadFile, validateImageFile, validateDocumentFile } from '../../firebase/storage.service';
import { toast } from 'sonner';
import type { Category, SellerOnboardingData, SellerProfile } from '../types';

const STEPS = [
  { id: 1, title: 'Tu negocio', icon: Store },
  { id: 2, title: 'Imágenes', icon: ImagePlus },
  { id: 3, title: 'Documentos', icon: FileText },
  { id: 4, title: 'Listo', icon: CheckCircle2 },
];

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'tipica', label: 'Típica', emoji: '🍲' },
  { id: 'rapida', label: 'Rápida', emoji: '🍔' },
  { id: 'saludable', label: 'Saludable', emoji: '🥗' },
  { id: 'cafeteria', label: 'Cafetería', emoji: '☕' },
  { id: 'gourmet', label: 'Gourmet', emoji: '✨' },
  { id: 'ofertas', label: 'Ofertas', emoji: '🔥' },
];

const INITIAL_DATA: SellerOnboardingData = {
  restaurantName: '', description: '', category: '',
  address: '', city: 'Ibagué', phone: '', schedule: 'Lun-Dom 8:00am - 8:00pm',
  estimatedTime: '25-35 min', deliveryFee: 4000, minOrder: 15000,
  logo: null, logoPreview: '', banner: null, bannerPreview: '',
  identityDoc: null, foodHandlerDoc: null, rutDoc: null, sanitaryDoc: null,
};

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { saveProfile } = useSellerStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SellerOnboardingData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const update = (field: keyof SellerOnboardingData, value: unknown) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleImageSelect = (
    field: 'logo' | 'banner',
    file: File | null
  ) => {
    if (!file) return;
    const err = validateImageFile(file);
    if (err) { toast.error(err); return; }
    const preview = URL.createObjectURL(file);
    update(field, file);
    update(`${field}Preview` as keyof SellerOnboardingData, preview);
  };

  const handleDocSelect = (
    field: 'identityDoc' | 'foodHandlerDoc' | 'rutDoc' | 'sanitaryDoc',
    file: File | null
  ) => {
    if (!file) return;
    const err = validateDocumentFile(file);
    if (err) { toast.error(err); return; }
    update(field, file);
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!data.restaurantName.trim()) { toast.error('El nombre del restaurante es requerido'); return false; }
      if (!data.description.trim()) { toast.error('La descripción es requerida'); return false; }
      if (!data.category) { toast.error('Selecciona una categoría'); return false; }
      if (!data.address.trim()) { toast.error('La dirección es requerida'); return false; }
      if (!data.phone.trim()) { toast.error('El teléfono es requerido'); return false; }
    }
    if (step === 2) {
      if (!data.logoPreview) { toast.error('El logo es requerido'); return false; }
      if (!data.bannerPreview) { toast.error('El banner es requerido'); return false; }
    }
    if (step === 3) {
      if (!data.identityDoc) { toast.error('El documento de identidad es requerido'); return false; }
      if (!data.foodHandlerDoc) { toast.error('El certificado de manipulación es requerido'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 3) { setCurrentStep((s) => s + 1); return; }
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      let logoUrl = data.logoPreview;
      let bannerUrl = data.bannerPreview;

      if (data.logo) {
        logoUrl = await uploadFile(data.logo, 'logos', user.id, (p) =>
          setUploadProgress((prev) => ({ ...prev, logo: p.progress }))
        );
      }
      if (data.banner) {
        bannerUrl = await uploadFile(data.banner, 'banners', user.id, (p) =>
          setUploadProgress((prev) => ({ ...prev, banner: p.progress }))
        );
      }

      const docUrls: SellerProfile['documents'] = {};
      if (data.identityDoc) {
        docUrls.identity = await uploadFile(data.identityDoc, 'documents', user.id, (p) =>
          setUploadProgress((prev) => ({ ...prev, identity: p.progress }))
        );
      }
      if (data.foodHandlerDoc) {
        docUrls.foodHandler = await uploadFile(data.foodHandlerDoc, 'documents', user.id, (p) =>
          setUploadProgress((prev) => ({ ...prev, foodHandler: p.progress }))
        );
      }
      if (data.rutDoc) {
        docUrls.rut = await uploadFile(data.rutDoc, 'documents', user.id, (p) =>
          setUploadProgress((prev) => ({ ...prev, rut: p.progress }))
        );
      }
      if (data.sanitaryDoc) {
        docUrls.sanitary = await uploadFile(data.sanitaryDoc, 'documents', user.id, (p) =>
          setUploadProgress((prev) => ({ ...prev, sanitary: p.progress }))
        );
      }

      const profile: SellerProfile = {
        sellerId: user.id,
        restaurantName: data.restaurantName,
        description: data.description,
        category: data.category as Category,
        address: data.address,
        city: data.city,
        phone: data.phone,
        schedule: data.schedule,
        estimatedTime: data.estimatedTime,
        deliveryFee: data.deliveryFee,
        minOrder: data.minOrder,
        status: 'pending',
        logo: logoUrl,
        banner: bannerUrl,
        documents: docUrls,
      };

      await saveProfile(profile);
      setCurrentStep(4);
    } catch (err) {
      toast.error('Error al guardar el perfil. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <span className="text-white text-base">🍲</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Sabor Tolima</h1>
            <p className="text-xs text-muted-foreground">Registro de vendedor</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isDone = step.id < currentStep;
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isDone ? 'bg-green-500' : isActive ? 'bg-primary' : 'bg-muted'
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                      <span className={`text-[10px] font-medium hidden sm:block ${
                        isActive ? 'text-primary' : isDone ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                        step.id < currentStep ? 'bg-green-400' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Paso {currentStep} de 3
            </p>
          </div>
        )}

        {/* Step 1: Business info */}
        {currentStep === 1 && (
          <StepBusinessInfo data={data} update={update} />
        )}

        {/* Step 2: Images */}
        {currentStep === 2 && (
          <StepImages
            data={data}
            onLogoSelect={(f) => handleImageSelect('logo', f)}
            onBannerSelect={(f) => handleImageSelect('banner', f)}
            onRemoveLogo={() => { update('logo', null); update('logoPreview', ''); }}
            onRemoveBanner={() => { update('banner', null); update('bannerPreview', ''); }}
          />
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <StepDocuments
            data={data}
            onDocSelect={handleDocSelect}
            uploadProgress={uploadProgress}
          />
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <StepSuccess onGoToDashboard={() => navigate('/seller-dashboard')} />
        )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex-1 rounded-xl gap-2"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : currentStep === 3 ? (
                <><CheckCircle2 className="w-4 h-4" /> Enviar solicitud</>
              ) : (
                <>Siguiente <ChevronRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Step sub-components ─────────────────────────────────────────────────────

function StepBusinessInfo({
  data,
  update,
}: {
  data: SellerOnboardingData;
  update: (f: keyof SellerOnboardingData, v: unknown) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Información del negocio</h2>
        <p className="text-sm text-muted-foreground">Cuéntanos sobre tu restaurante</p>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <Field label="Nombre del restaurante *">
            <Input
              placeholder="Ej: Lechona Tradicional Tolima"
              value={data.restaurantName}
              onChange={(e) => update('restaurantName', e.target.value)}
              className="rounded-xl"
            />
          </Field>

          <Field label="Descripción *">
            <Textarea
              placeholder="Describe tu restaurante, especialidades y lo que te hace único..."
              value={data.description}
              onChange={(e) => update('description', e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
          </Field>

          <Field label="Categoría gastronómica *">
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => update('category', cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all ${
                    data.category === cat.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className={`text-xs font-semibold ${
                    data.category === cat.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </Field>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Ubicación y contacto
          </h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Dirección *">
              <Input
                placeholder="Calle 10 # 5-23"
                value={data.address}
                onChange={(e) => update('address', e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Ciudad">
              <Input
                placeholder="Ibagué"
                value={data.city}
                onChange={(e) => update('city', e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Teléfono *">
              <Input
                placeholder="300 123 4567"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Horario">
              <Input
                placeholder="Lun-Dom 8:00am - 8:00pm"
                value={data.schedule}
                onChange={(e) => update('schedule', e.target.value)}
                className="rounded-xl"
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Configuración de entrega
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Tiempo estimado">
              <Input
                placeholder="25-35 min"
                value={data.estimatedTime}
                onChange={(e) => update('estimatedTime', e.target.value)}
                className="rounded-xl"
              />
            </Field>
            <Field label="Costo de envío ($)">
              <Input
                type="number"
                placeholder="4000"
                value={data.deliveryFee}
                onChange={(e) => update('deliveryFee', Number(e.target.value))}
                className="rounded-xl"
              />
            </Field>
            <Field label="Pedido mínimo ($)">
              <Input
                type="number"
                placeholder="15000"
                value={data.minOrder}
                onChange={(e) => update('minOrder', Number(e.target.value))}
                className="rounded-xl"
              />
            </Field>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepImages({
  data,
  onLogoSelect,
  onBannerSelect,
  onRemoveLogo,
  onRemoveBanner,
}: {
  data: SellerOnboardingData;
  onLogoSelect: (f: File) => void;
  onBannerSelect: (f: File) => void;
  onRemoveLogo: () => void;
  onRemoveBanner: () => void;
}) {
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Imágenes del restaurante</h2>
        <p className="text-sm text-muted-foreground">Sube el logo y banner de tu negocio</p>
      </div>

      {/* Logo */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-3">
            Logo del restaurante *
          </h3>
          {data.logoPreview ? (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={data.logoPreview}
                alt="Logo preview"
                className="w-full h-full object-cover rounded-2xl border border-border"
              />
              <button
                onClick={onRemoveLogo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => logoRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all"
            >
              <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Subir logo</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG o WEBP · Máx 5MB</p>
            </button>
          )}
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onLogoSelect(e.target.files[0])}
          />
          {!data.logoPreview && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 rounded-xl"
              onClick={() => logoRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" /> Seleccionar logo
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Banner */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-3">
            Banner del restaurante *
          </h3>
          {data.bannerPreview ? (
            <div className="relative w-full h-40">
              <img
                src={data.bannerPreview}
                alt="Banner preview"
                className="w-full h-full object-cover rounded-2xl border border-border"
              />
              <button
                onClick={onRemoveBanner}
                className="absolute top-2 right-2 w-7 h-7 bg-destructive text-white rounded-full flex items-center justify-center shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => bannerRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-all"
            >
              <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Subir banner</p>
              <p className="text-xs text-muted-foreground mt-1">Recomendado: 1200×400px · Máx 5MB</p>
            </button>
          )}
          <input
            ref={bannerRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onBannerSelect(e.target.files[0])}
          />
          {!data.bannerPreview && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 rounded-xl"
              onClick={() => bannerRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" /> Seleccionar banner
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepDocuments({
  data,
  onDocSelect,
  uploadProgress,
}: {
  data: SellerOnboardingData;
  onDocSelect: (field: 'identityDoc' | 'foodHandlerDoc' | 'rutDoc' | 'sanitaryDoc', file: File) => void;
  uploadProgress: Record<string, number>;
}) {
  const docs = [
    { field: 'identityDoc' as const, label: 'Documento de identidad *', required: true, icon: '🪪' },
    { field: 'foodHandlerDoc' as const, label: 'Certificado manipulación de alimentos *', required: true, icon: '🍽️' },
    { field: 'rutDoc' as const, label: 'RUT o documento comercial', required: false, icon: '📄' },
    { field: 'sanitaryDoc' as const, label: 'Permiso sanitario', required: false, icon: '🏥' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Documentos requeridos</h2>
        <p className="text-sm text-muted-foreground">
          Necesitamos verificar tu identidad y habilitaciones para operar
        </p>
      </div>

      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
        <span className="text-base">⚠️</span>
        <span>
          Tu restaurante será revisado por nuestro equipo antes de publicarse. El proceso toma 24-48 horas hábiles.
        </span>
      </div>

      <div className="space-y-3">
        {docs.map(({ field, label, required, icon }) => {
          const file = data[field] as File | null;
          const progress = uploadProgress[field.replace('Doc', '')];
          const inputRef = useRef<HTMLInputElement>(null);

          return (
            <Card key={field} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-lg shrink-0">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                      {file ? (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          {file.name.length > 25 ? file.name.slice(0, 25) + '...' : file.name}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          PDF, JPG o PNG · Máx 10MB
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={file ? 'outline' : 'default'}
                    size="sm"
                    className="rounded-xl shrink-0"
                    onClick={() => inputRef.current?.click()}
                  >
                    {file ? <><X className="w-3 h-3 mr-1" /> Cambiar</> : <><Upload className="w-3 h-3 mr-1" /> Subir</>}
                  </Button>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onDocSelect(field, e.target.files[0])}
                  />
                </div>
                {progress !== undefined && progress < 100 && (
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StepSuccess({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        ¡Solicitud enviada!
      </h2>
      <p className="text-muted-foreground mb-2 max-w-sm mx-auto leading-relaxed">
        Hemos recibido tu solicitud. Nuestro equipo revisará tu información y documentos.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Tiempo de revisión: <strong className="text-foreground">24-48 horas hábiles</strong>
      </p>

      <div className="space-y-3 max-w-xs mx-auto">
        {[
          { icon: '📋', text: 'Revisión de documentos' },
          { icon: '✅', text: 'Aprobación del restaurante' },
          { icon: '🚀', text: 'Publicación en el marketplace' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl text-sm text-foreground">
            <span className="text-lg">{icon}</span>
            {text}
          </div>
        ))}
      </div>

      <Button
        onClick={onGoToDashboard}
        className="mt-8 rounded-xl bg-primary hover:bg-primary/90 text-white px-8"
      >
        Ir a mi panel
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}
