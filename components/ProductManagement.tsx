'use client'

import { useState, ChangeEvent, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Image as ImageIcon, Info } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'


type Size = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
type SizeQuantity = { [key in Size]?: number }

type Product = {
  id: number
  name: string
  style: string
  fabric: string
  vendor: string
  sizeQuantities: SizeQuantity
  poDate: string
  image: File | null
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Crect width='36' height='36' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-size='12'%3EU1%3C/text%3E%3C/svg%3E"

export function ProductManagement({ onUpdate }: { onUpdate: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    style: '',
    fabric: '',
    vendor: '',
    sizeQuantities: {},
    poDate: '',
    image: null
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  const sizes: Size[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = async () => {
    try {
      // Log the data being sent
      console.log('Submitting product data:', {
        ...newProduct,
        sizeQuantities: Object.fromEntries(
          Object.entries(newProduct.sizeQuantities).filter(([_, quantity]) => quantity > 0)
        )
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          sizeQuantities: Object.fromEntries(
            Object.entries(newProduct.sizeQuantities).filter(([_, quantity]) => quantity > 0)
          )
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      await fetchProducts();
      setNewProduct({ name: '', style: '', fabric: '', vendor: '', sizeQuantities: {}, poDate: '', image: null });
      setShowSuccessDialog(true);
      onUpdate();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }
  ///
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      let imageData: string | null = null;
      if (editingProduct.image) {
        imageData = await convertFileToBase64(editingProduct.image);
      }

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          image: imageData,
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      await fetchProducts();
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };
  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      await fetchProducts();
      setShowDeleteDialog(false);
      setProductToDelete(null);
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0] || null
    if (isEditing && editingProduct) {
      setEditingProduct({ ...editingProduct, image: file })
    } else {
      setNewProduct({ ...newProduct, image: file })
    }
  }

  const handleSizeQuantityChange = (size: Size, quantity: number, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        sizeQuantities: {
          ...editingProduct.sizeQuantities,
          [size]: quantity
        }
      });
    } else {
      setNewProduct({
        ...newProduct,
        sizeQuantities: {
          ...newProduct.sizeQuantities,
          [size]: quantity
        }
      });
    }
  };

  const calculateTotalQuantity = (sizeQuantities: SizeQuantity) => {
    return Object.values(sizeQuantities || {}).reduce((sum, qty) => sum + (qty || 0), 0);
  };

  const renderProductForm = (product: Omit<Product, 'id'>, isEditing: boolean) => (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={isEditing ? "edit-name" : "name"} className="text-right">Name</Label>
          <Input
            id={isEditing ? "edit-name" : "name"}
            value={product.name}
            onChange={(e) => isEditing ? setEditingProduct({ ...editingProduct!, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={isEditing ? "edit-style" : "style"} className="text-right">Style</Label>
          <Input
            id={isEditing ? "edit-style" : "style"}
            value={product.style}
            onChange={(e) => isEditing ? setEditingProduct({ ...editingProduct!, style: e.target.value }) : setNewProduct({ ...newProduct, style: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={isEditing ? "edit-fabric" : "fabric"} className="text-right">Fabric</Label>
          <Input
            id={isEditing ? "edit-fabric" : "fabric"}
            value={product.fabric}
            onChange={(e) => isEditing ? setEditingProduct({ ...editingProduct!, fabric: e.target.value }) : setNewProduct({ ...newProduct, fabric: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={isEditing ? "edit-vendor" : "vendor"} className="text-right">Vendor</Label>
          <Input
            id={isEditing ? "edit-vendor" : "vendor"}
            value={product.vendor}
            onChange={(e) => isEditing ? setEditingProduct({ ...editingProduct!, vendor: e.target.value }) : setNewProduct({ ...newProduct, vendor: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Sizes</Label>
          <div className="col-span-3 space-y-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`${isEditing ? 'edit-' : ''}size-${size}`}
                  checked={(product.sizeQuantities || {})[size] !== undefined}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSizeQuantityChange(size, 0, isEditing)
                    } else {
                      const { [size]: removed, ...rest } = product.sizeQuantities || {}
                      if (isEditing) {
                        setEditingProduct({ ...editingProduct!, sizeQuantities: rest })
                      } else {
                        setNewProduct({ ...newProduct, sizeQuantities: rest })
                      }
                    }
                  }}
                />
                <Label htmlFor={`${isEditing ? 'edit-' : ''}size-${size}`}>{size}</Label>
                {product.sizeQuantities && product.sizeQuantities[size] !== undefined && (
                  <Input
                    type="number"
                    value={(product.sizeQuantities || {})[size] || 0}
                    onChange={(e) => handleSizeQuantityChange(size, parseInt(e.target.value) || 0, isEditing)}
                    className="w-20"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Total Quantity</Label>
          <div className="col-span-3">
            <Badge variant="secondary" className="text-lg">
              {calculateTotalQuantity(product.sizeQuantities)}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={isEditing ? "edit-poDate" : "poDate"} className="text-right">PO Date</Label>
          <Input
            id={isEditing ? "edit-poDate" : "poDate"}
            type="date"
            value={product.poDate}
            onChange={(e) => isEditing ? setEditingProduct({ ...editingProduct!, poDate: e.target.value }) : setNewProduct({ ...newProduct, poDate: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={isEditing ? "edit-image" : "image"} className="text-right">Image (Optional)</Label>
          <Input
            id={isEditing ? "edit-image" : "image"}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, isEditing)}
            className="col-span-3"
          />
        </div>
      </div>
    </ScrollArea>
  )

  return (
    <Card className="space-y-8">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Product Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter the details for the new product.</DialogDescription>
              </DialogHeader>
              {renderProductForm(newProduct, false)}
              <DialogFooter>
                <Button onClick={handleCreateProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Style</TableHead>
              <TableHead>Fabric</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>PO Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <Image
                      src={typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image)}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <Image 
                      src={placeholderImage} 
                      width={36} 
                      height={36} 
                      alt="User 1" 
                    />
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.style}</TableCell>
                <TableCell>{product.fabric}</TableCell>
                <TableCell>{product.vendor}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4 mr-2" /> View Sizes
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Size Quantities</h4>
                          <p className="text-sm text-muted-foreground">
                            Breakdown of quantities for each size.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          {Object.entries(product.sizeQuantities || {}).map(([size, quantity]) => (
                            <div key={size} className="flex items-center justify-between">
                              <span>{size}:</span>
                              <Badge variant="secondary">{quantity}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Badge>{calculateTotalQuantity(product.sizeQuantities)}</Badge>
                </TableCell>
                <TableCell>{product.poDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="mr-2" onClick={() => handleEditProduct(product)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update the details for the product.</DialogDescription>
            </DialogHeader>
            {renderProductForm(editingProduct, true)}
            <DialogFooter>
              <Button onClick={handleUpdateProduct}>Update Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AnimatePresence>
        {showSuccessDialog && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Success</DialogTitle>
                  <DialogDescription>Product added successfully!</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}