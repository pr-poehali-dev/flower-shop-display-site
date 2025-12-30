import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Bouquet {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

const bouquets: Bouquet[] = [
  {
    id: 1,
    name: 'Розы Premium',
    price: 4500,
    category: 'mono',
    image: 'https://cdn.poehali.dev/projects/2d5ddf42-666a-4214-bff1-ce74864330bc/files/b0a3d8c8-39ce-4b87-9510-95658c8fbd91.jpg',
    description: 'Монобукет из 25 нежных розовых роз'
  },
  {
    id: 2,
    name: 'Солнечный день',
    price: 4200,
    category: 'mixed',
    image: 'https://cdn.poehali.dev/projects/2d5ddf42-666a-4214-bff1-ce74864330bc/files/7964070f-5ddc-47b9-bc73-f4d314ec09c8.jpg',
    description: 'Сборный букет из желтых и оранжевых цветов'
  },
  {
    id: 3,
    name: 'Весенний сад',
    price: 2800,
    category: 'mixed',
    image: 'https://cdn.poehali.dev/projects/2d5ddf42-666a-4214-bff1-ce74864330bc/files/5c02e7be-166e-4783-94ae-94a1aa1e8c19.jpg',
    description: 'Свежий весенний букет с тюльпанами и нарциссами'
  },
  {
    id: 4,
    name: 'Цветочная коробка',
    price: 5500,
    category: 'composition',
    image: 'https://cdn.poehali.dev/projects/2d5ddf42-666a-4214-bff1-ce74864330bc/files/b0a3d8c8-39ce-4b87-9510-95658c8fbd91.jpg',
    description: 'Элегантная композиция из роз в шляпной коробке'
  },
  {
    id: 5,
    name: 'Мишка с цветами',
    price: 3200,
    category: 'toys',
    image: '/placeholder.svg',
    description: 'Плюшевый мишка с букетом из 15 роз'
  },
  {
    id: 6,
    name: 'Букет с Raffaello',
    price: 4800,
    category: 'sweets',
    image: '/placeholder.svg',
    description: 'Нежный букет с конфетами Raffaello'
  },
  {
    id: 7,
    name: 'Цветы и шары',
    price: 3900,
    category: 'balloons',
    image: '/placeholder.svg',
    description: 'Букет с гелиевыми шарами в подарок'
  },
  {
    id: 8,
    name: 'Пионы белые',
    price: 6800,
    category: 'mono',
    image: 'https://cdn.poehali.dev/projects/2d5ddf42-666a-4214-bff1-ce74864330bc/files/b0a3d8c8-39ce-4b87-9510-95658c8fbd91.jpg',
    description: 'Монобукет из ароматных белых пионов'
  },
  {
    id: 9,
    name: 'Корзина с цветами',
    price: 7500,
    category: 'composition',
    image: 'https://cdn.poehali.dev/projects/2d5ddf42-666a-4214-bff1-ce74864330bc/files/5c02e7be-166e-4783-94ae-94a1aa1e8c19.jpg',
    description: 'Роскошная композиция в плетеной корзине'
  }
];

const reviews = [
  {
    id: 1,
    name: 'Анна',
    text: 'Потрясающие букеты! Доставили точно в срок, цветы свежие и ароматные',
    rating: 5
  },
  {
    id: 2,
    name: 'Дмитрий',
    text: 'Заказал букет для жены на юбилей. Она в восторге! Спасибо за качество',
    rating: 5
  },
  {
    id: 3,
    name: 'Мария',
    text: 'Лучший цветочный магазин в городе. Всегда свежие цветы и креативные композиции',
    rating: 5
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedBouquet, setSelectedBouquet] = useState<Bouquet | null>(null);

  const filteredBouquets =
    selectedCategory === 'all'
      ? bouquets
      : bouquets.filter((b) => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Цветочная</h1>
          <nav className="hidden md:flex gap-8">
            <a href="#catalog" className="text-foreground hover:text-primary transition-colors">
              Каталог
            </a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Услуги
            </a>
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
              Галерея
            </a>
            <a href="#reviews" className="text-foreground hover:text-primary transition-colors">
              Отзывы
            </a>
            <a href="#contacts" className="text-foreground hover:text-primary transition-colors">
              Контакты
            </a>
          </nav>
          <Button variant="outline" size="sm" className="md:hidden">
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Свежие цветы каждый день
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Создаем уникальные букеты с любовью и доставляем точно в срок
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Выбрать букет
          </Button>
        </div>
      </section>

      <section id="catalog" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Каталог букетов</h2>

          <Tabs defaultValue="all" className="mb-12" onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-7 h-auto">
              <TabsTrigger value="all" className="py-3">
                Все
              </TabsTrigger>
              <TabsTrigger value="mono" className="py-3">
                Монобукеты
              </TabsTrigger>
              <TabsTrigger value="mixed" className="py-3">
                Сборные
              </TabsTrigger>
              <TabsTrigger value="composition" className="py-3">
                Композиции
              </TabsTrigger>
              <TabsTrigger value="toys" className="py-3">
                Игрушки
              </TabsTrigger>
              <TabsTrigger value="sweets" className="py-3">
                Конфеты
              </TabsTrigger>
              <TabsTrigger value="balloons" className="py-3">
                Шары
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBouquets.map((bouquet) => (
              <Card
                key={bouquet.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in cursor-pointer group"
                onClick={() => setSelectedBouquet(bouquet)}
              >
                <div className="aspect-square bg-accent overflow-hidden">
                  <img
                    src={bouquet.image}
                    alt={bouquet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">{bouquet.name}</h3>
                  <p className="text-muted-foreground mb-4">{bouquet.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{bouquet.price} ₽</span>
                    <Button size="sm">Заказать</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-secondary/30 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-3xl font-semibold mb-6 text-center">Забронировать доставку</h3>
            <div className="flex flex-col items-center gap-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full max-w-md justify-start text-left font-normal">
                    <Icon name="Calendar" size={20} className="mr-2" />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: ru }) : 'Выберите дату доставки'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ru} />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <div className="text-center animate-fade-in">
                  <p className="text-muted-foreground mb-4">Доставка запланирована на:</p>
                  <p className="text-xl font-semibold text-primary">
                    {format(selectedDate, 'PPP', { locale: ru })}
                  </p>
                  <Button className="mt-4" size="lg">
                    Подтвердить бронирование
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Наши услуги</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Truck" size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Быстрая доставка</h3>
              <p className="text-muted-foreground">
                Доставляем букеты по городу за 2 часа. Точно в срок к вашему событию
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Palette" size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Индивидуальное оформление</h3>
              <p className="text-muted-foreground">
                Создаем уникальные композиции по вашим пожеланиям и случаю
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Heart" size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Свежесть гарантирована</h3>
              <p className="text-muted-foreground">
                Работаем только со свежими цветами. Гарантия качества 7 дней
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Галерея работ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-accent rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src="/placeholder.svg"
                  alt={`Работа ${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Отзывы клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{review.text}</p>
                <p className="font-semibold">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Контакты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <Icon name="Phone" size={32} className="text-primary mx-auto mb-4" />
              <p className="font-semibold mb-2">Телефон</p>
              <p className="text-muted-foreground">+7 (999) 123-45-67</p>
            </div>
            <div>
              <Icon name="Mail" size={32} className="text-primary mx-auto mb-4" />
              <p className="font-semibold mb-2">Email</p>
              <p className="text-muted-foreground">info@flowers.ru</p>
            </div>
            <div>
              <Icon name="MapPin" size={32} className="text-primary mx-auto mb-4" />
              <p className="font-semibold mb-2">Адрес</p>
              <p className="text-muted-foreground">г. Москва, ул. Цветочная, 1</p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            Заказать букет
          </Button>
        </div>
      </section>

      <footer className="bg-foreground text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Цветочная</h3>
          <p className="text-white/70 mb-6">Свежие цветы с любовью</p>
          <div className="flex gap-6 justify-center">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Icon name="Instagram" size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Icon name="Facebook" size={24} />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <Icon name="Send" size={24} />
            </a>
          </div>
        </div>
      </footer>

      <Dialog open={!!selectedBouquet} onOpenChange={() => setSelectedBouquet(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl">{selectedBouquet?.name}</DialogTitle>
          </DialogHeader>
          {selectedBouquet && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-accent rounded-xl overflow-hidden">
                <img src={selectedBouquet.image} alt={selectedBouquet.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-muted-foreground mb-6">{selectedBouquet.description}</p>
                  <p className="text-3xl font-bold text-primary mb-6">{selectedBouquet.price} ₽</p>
                </div>
                <Button size="lg" className="w-full">
                  Заказать букет
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;