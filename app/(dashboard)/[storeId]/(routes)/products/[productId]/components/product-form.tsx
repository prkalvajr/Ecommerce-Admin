"use client";

import  * as z from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1),
    imageUrl: z.string().min(1)
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Billboard | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product"; 
    const description = initialData ? "Edit a product" : "Add a new product"; 
    const toastMessage = initialData ? "Product updated" : "Product created"; 
    const action = initialData ? "Save changes" : "Create"; 

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData)
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            else
                await axios.post(`/api/${params.storeId}/products`, data);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong");
        } finally{
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted.");
        } catch (error) {
            toast.error("Error deleting product");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />

                {initialData && (
                 <Button disabled={loading} variant="destructive" size="sm" 
                   onClick={() => { setOpen(true)}}>
                    <Trash className="h-4 w-4" />
                 </Button>
                 )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []} 
                                    disabled={loading} onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}