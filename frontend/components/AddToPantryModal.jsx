/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useFetch from "@/hooks/use-fetch";
import {
    scanPantryImage,
    saveToPantry,
    addPantryItemManually,
} from "@/actions/pantry.actions";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

const AddToPantryModal = ({ isOpen, onClose, onSuccess }) => {
    const [activeTab, setActiveTab] = useState("scan");
    const [selectedImage, setSelectedImage] = useState(null);
    const [scannedIngredients, setScannedIngredients] = useState([]);
    const [manualItem, setManualItem] = useState({ name: "", quantity: "" });


    // Scan image
    const {
        loading: scanning,
        data: scanData,
        fn: scanImage,
    } = useFetch(scanPantryImage);

    useEffect(() => {
        if (scanData?.success && scanData?.ingredients) {
            setScannedIngredients(scanData.ingredients);
            toast.success(`Found ${scanData.ingredients.length} ingredients!`);
        }
    }, [scanData]);

    // Save scanned items
    const {
        loading: saving,
        data: saveData,
        fn: saveScannedItems,
    } = useFetch(saveToPantry);

    // Add manual item
    const {
        loading: adding,
        data: addData,
        fn: addManualItem,
    } = useFetch(addPantryItemManually);


    useEffect(() => {
        if (addData?.success) {
            toast.success("Item added to pantry!");
            setManualItem({ name: "", quantity: "" });
            handleClose();
            if (onSuccess) onSuccess();
        }
    }, [addData]);



    const handleClose = () => {
        setActiveTab("scan");
        setSelectedImage(null);
        setScannedIngredients([]);
        setManualItem({ name: "", quantity: "" });
        onClose();
    };

    const handleImageSelect = (file) => {
        setSelectedImage(file);
        setScannedIngredients([]); // Reset when new image selected
    };

    const handleAddManual = async (e) => {
        e.preventDefault();
        if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", manualItem.name);
        formData.append("quantity", manualItem.quantity);
        await addManualItem(formData);
    };

    const handleScan = async () => {
        if (!selectedImage) return;
        const formData = new FormData();
        formData.append("image", selectedImage);
        await scanImage(formData);
    };


    const handleSaveScanned = async () => {
        if (scannedIngredients.length === 0) {
            toast.error("No ingredients to save");
            return;
        }

        const formData = new FormData();
        formData.append("ingredients", JSON.stringify(scannedIngredients));
        await saveScannedItems(formData);
    };

    useEffect(() => {
        if (saveData?.success) {
            toast.success(saveData.message);
            handleClose();
            if (onSuccess) onSuccess();
        }
    }, [saveData]);

    const removeIngredient = (index) => {
        setScannedIngredients(scannedIngredients.filter((_, i) => i !== index));
    };;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        Add to Pantry
                    </DialogTitle>
                    <DialogDescription>
                        Scan your pantry with AI or add items manually
                    </DialogDescription>
                </DialogHeader>


                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="scan" className="gap-2">
                            <Camera className="w-4 h-4" />
                            AI Scan
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Manually
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="scan" className="space-y-6 mt-6">
                        {scannedIngredients.length === 0 ? (<div>
                            {/*image uploader */}
                            <ImageUploader
                                onImageSelect={handleImageSelect}
                                loading={scanning}
                            />

                            {selectedImage && !scanning && (
                                <Button
                                    onClick={handleScan}
                                    variant="primary"
                                    className="w-full h-12 text-lg"
                                    disabled={scanning}
                                >
                                    {scanning ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-5 h-5 mr-2" />
                                            Scan Image
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-stone-900">
                                            Review Detected Items
                                        </h3>
                                        <p className="text-sm text-stone-600">
                                            Found {scannedIngredients.length} ingredients
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setScannedIngredients([]);
                                            setSelectedImage(null);
                                        }}
                                        className="h-8 px-2 text-xs gap-1 rounded-lg"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                        Scan Again
                                    </Button>
                                </div>

                                <div className="space-y-2 max-h-75 overflow-y-auto pr-1">
                                    {scannedIngredients.map((ingredient, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-3 py-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition"
                                        >
                                            <div className="flex-1 leading-tight">
                                                <div className="font-medium text-stone-900">
                                                    {ingredient.name}
                                                </div>
                                                <div className="text-sm text-stone-500">
                                                    {ingredient.quantity}
                                                </div>
                                            </div>


                                            {ingredient.confidence && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs text-green-700 border-green-200"
                                                >
                                                    {Math.round(ingredient.confidence * 100)}%
                                                </Badge>
                                            )}


                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => removeIngredient(index)}
                                                className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-600"                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleSaveScanned}
                                    disabled={saving || scannedIngredients.length === 0}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 w-full"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 aniamte-spin" />
                                            saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5 mr-2" />
                                            save {scannedIngredients.length} Item to Pantry
                                        </>
                                    )}

                                </Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="manual" className="space-y-6 mt-6">
                        <form onSubmit={handleAddManual} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Ingredient Name
                                </label>
                                <input
                                    type="text"
                                    value={manualItem.name}
                                    onChange={(e) =>
                                        setManualItem({ ...manualItem, name: e.target.value })
                                    }
                                    placeholder="e.g., Chicken breast"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    disabled={adding}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="text"
                                    value={manualItem.quantity}
                                    onChange={(e) =>
                                        setManualItem({ ...manualItem, quantity: e.target.value })
                                    }
                                    placeholder="e.g., 500g, 2 cups, 3 pieces"
                                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    disabled={adding}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={adding}
                                variant="primary"
                                className="flex-1 h-12 w-full"
                            >
                                {adding ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Item
                                    </>
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddToPantryModal