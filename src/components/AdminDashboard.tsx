import { useState, useEffect } from "react";
import { signOut } from "@/lib/auth";
import { getProducts, deleteProduct } from "@/lib/products";
import { getCategories, deleteCategory } from "@/lib/categories";
import { getOrders } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "./ProductForm";
import { CategoryForm } from "./CategoryForm";
import { User } from "firebase/auth";
import { Product, Category, Order } from "@/types/firebase";

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, ordersData] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteProduct = async (id: string) => {
    const success = await deleteProduct(id);
    if (success) {
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchData();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const success = await deleteCategory(id);
    if (success) {
      toast({ title: "Success", description: "Category deleted successfully" });
      fetchData();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={() => setActiveTab("products")} 
          variant={activeTab === "products" ? "default" : "outline"}
        >
          Products ({products.length})
        </Button>
        <Button 
          onClick={() => setActiveTab("categories")} 
          variant={activeTab === "categories" ? "default" : "outline"}
        >
          Categories ({categories.length})
        </Button>
        <Button 
          onClick={() => setActiveTab("orders")} 
          variant={activeTab === "orders" ? "default" : "outline"}
        >
          Orders ({orders.length})
        </Button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Products</h2>
            <Button onClick={() => setShowProductForm(true)}>Add Product</Button>
          </div>
          
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="glossy-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Category: {getCategoryName(product.category_id)}
                      </p>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Categories</h2>
            <Button onClick={() => setShowCategoryForm(true)}>Add Category</Button>
          </div>
          
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="glossy-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{category.name}</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Orders</h2>
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="glossy-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Order #{order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        Total: ${order.total_amount} • {order.payment_method}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.created_at.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showProductForm && (
        <ProductForm
          categories={categories}
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            fetchData();
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            fetchData();
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};