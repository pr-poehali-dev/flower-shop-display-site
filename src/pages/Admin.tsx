import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
  composition: string;
  is_available: boolean;
}

const API_URL = 'https://functions.poehali.dev/3e598073-592e-4089-86dd-885a1054d9b9';

const Admin = () => {
  const [token, setToken] = useState<string>(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('adminToken'));
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'mono', label: 'Монобукеты' },
    { value: 'mixed', label: 'Сборные' },
    { value: 'composition', label: 'Композиции' },
    { value: 'toys', label: 'Игрушки' },
    { value: 'sweets', label: 'Конфеты' },
    { value: 'balloons', label: 'Шары' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (token.trim()) {
      localStorage.setItem('adminToken', token);
      setIsAuthenticated(true);
      toast({ title: 'Вход выполнен', description: 'Добро пожаловать в админ-панель' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setToken('');
    toast({ title: 'Выход выполнен' });
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}?all=true`, {
        headers: { 'X-Admin-Token': token }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить товары', variant: 'destructive' });
    }
  };

  const handleSaveProduct = async (product: Partial<Product>) => {
    try {
      const method = product.id ? 'PUT' : 'POST';
      const response = await fetch(API_URL, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token
        },
        body: JSON.stringify(product)
      });

      if (response.status === 403) {
        toast({ title: 'Ошибка доступа', description: 'Неверный токен администратора', variant: 'destructive' });
        handleLogout();
        return;
      }

      if (response.ok) {
        toast({ title: 'Успех', description: product.id ? 'Товар обновлен' : 'Товар добавлен' });
        loadProducts();
        setIsDialogOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить товар', variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token }
      });

      if (response.ok) {
        toast({ title: 'Товар удален' });
        loadProducts();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить товар', variant: 'destructive' });
    }
  };

  const openEditDialog = (product?: Product) => {
    setEditingProduct(
      product || {
        id: 0,
        name: '',
        price: 0,
        category: 'mono',
        image_url: '',
        description: '',
        composition: '',
        is_available: true
      }
    );
    setIsDialogOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-secondary/20 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="token">Токен доступа</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Введите токен администратора"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className="bg-white border-b border-border py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Панель управления</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              <Icon name="Home" size={20} className="mr-2" />
              На сайт
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Товары ({products.length})</h2>
          <Button onClick={() => openEditDialog()}>
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить товар
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className={!product.is_available ? 'opacity-60' : ''}>
              <div className="aspect-square bg-accent overflow-hidden">
                <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    {product.is_available ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">В наличии</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Нет в наличии</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                {product.composition && (
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong>Состав:</strong> {product.composition}
                  </p>
                )}
                <p className="text-xl font-bold text-primary mb-4">{product.price} ₽</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(product)} className="flex-1">
                    <Icon name="Pencil" size={16} className="mr-1" />
                    Изменить
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Цена (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={editingProduct.category}
                  onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="composition">Состав букета</Label>
                <Textarea
                  id="composition"
                  value={editingProduct.composition}
                  onChange={(e) => setEditingProduct({ ...editingProduct, composition: e.target.value })}
                  placeholder="Например: 15 роз, эвкалипт, упаковка крафт"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={editingProduct.is_available}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_available: checked })}
                />
                <Label htmlFor="is_available">Товар в наличии</Label>
              </div>
              <Button onClick={() => handleSaveProduct(editingProduct)} className="w-full">
                {editingProduct.id ? 'Сохранить изменения' : 'Добавить товар'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
