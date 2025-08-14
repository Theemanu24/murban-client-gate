import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Product, Category } from "@/types/firebase";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
  onClose: () => void;
  onSave: () => void;
}

export const ProductForm = ({ categories, product, onClose, onSave }: ProductFormProps) => {
  const [name, setName] = useState(product?.name || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [sizes, setSizes] = useState(JSON.stringify(product?.sizes || {}, null, 2));
  const [toppings, setToppings] = useState(product?.available_toppings?.join(", ") || "");
  const [status, setStatus] = useState<'active' | 'inactive'>(product?.status || "active");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sizesData = JSON.parse(sizes);
      const toppingsArray = toppings.split(",").map(t => t.trim()).filter(Boolean);

      const productData = {
        name,
        category_id: categoryId,
        sizes: sizesData,
        available_toppings: toppingsArray,
        status: status as 'active' | 'inactive',
      };

      let success;
      if (product) {
        success = await updateProduct(product.id, productData);
      } else {
        const id = await createProduct(productData);
        success = !!id;
      }

      if (!success) {
        throw new Error("Failed to save product");
      }

      toast({
        title: "Success",
        description: `Product ${product ? "updated" : "created"} successfully`,
      });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sizes">Sizes (JSON format)</Label>
            <textarea
              id="sizes"
              className="w-full p-2 border rounded-md min-h-[100px] text-sm"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder='{"small": 3.99, "medium": 4.99, "large": 5.99}'
              required
            />
          </div>

          <div>
            <Label htmlFor="toppings">Available Toppings (comma-separated)</Label>
            <Input
              id="toppings"
              value={toppings}
              onChange={(e) => setToppings(e.target.value)}
              placeholder="pearls, jellies, popping boba"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'active' | 'inactive')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};