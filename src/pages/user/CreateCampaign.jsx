import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateCampaign = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { toast: shadcnToast } = useToast();

    const initialFormState = {
        title: "",
        description: "",
        story: "",
        category: "",
        goalAmount: "",
        duration: "",
        images: [],
        videos: [],
        documents: [],
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [previewVideos, setPreviewVideos] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

    const categories = [
        "Education",
        "Medical",
        "Environment",
        "Animal Welfare",
        "Elderly Care",
        "Child Welfare",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + formData.images.length > 5) {
            toast.error("You can upload maximum 5 images");
            return;
        }
        
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            toast.error("Only JPG, JPEG, and PNG files are allowed");
            return;
        }
        
        const maxSize = 5 * 1024 * 1024;
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            toast.error("Some images exceed the 5MB size limit");
            return;
        }
        
        setFormData({
            ...formData,
            images: [...formData.images, ...files].slice(0, 5),
        });
        
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviewUrls].slice(0, 5));
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({
            ...formData,
            images: newImages,
        });

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const handleVideosChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            videos: files,
        });
        
        previewVideos.forEach(url => URL.revokeObjectURL(url));
        setPreviewVideos(files.map((file) => URL.createObjectURL(file)));
    };

    const handleDocumentsChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            documents: files,
        });
        setUploadedDocuments(files);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.story.trim()) newErrors.story = "Story is required";
        if (!formData.category) newErrors.category = "Category is required";

        if (!formData.goalAmount) {
            newErrors.goalAmount = "Goal amount is required";
        } else if (isNaN(formData.goalAmount) || Number(formData.goalAmount) <= 0) {
            newErrors.goalAmount = "Goal amount must be a positive number";
        }

        if (!formData.duration) {
            newErrors.duration = "Duration is required";
        } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
            newErrors.duration = "Duration must be a positive number";
        }

        if (!formData.images || formData.images.length === 0) {
            newErrors.images = "At least one campaign image is required";
        } else if (formData.images.length > 5) {
            newErrors.images = "Maximum 5 images allowed";
        }

        if (!formData.videos || formData.videos.length === 0) {
            newErrors.videos = "At least one campaign video is required";
        }

        if (!formData.documents || formData.documents.length === 0) {
            newErrors.documents = "At least one document is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        previewImages.forEach(url => URL.revokeObjectURL(url));
        previewVideos.forEach(url => URL.revokeObjectURL(url));
        
        setFormData(initialFormState);
        setPreviewImages([]);
        setPreviewVideos([]);
        setUploadedDocuments([]);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
        setIsSubmitting(true);
    
        const apiUrl = `${import.meta.env.VITE_API_URL}/campaigns`;
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("story", formData.story);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("goalAmount", formData.goalAmount);
            formDataToSend.append("duration", formData.duration);
    
            if (formData.images.length > 0) {
                formDataToSend.append("images", formData.images[0]);
                formData.images.slice(1).forEach((file) => {
                    formDataToSend.append("images", file);
                });
            }
    
            if (formData.videos.length > 0) {
                formData.videos.forEach((file) => {
                    formDataToSend.append("videos", file);
                });
            }
    
            if (formData.documents.length > 0) {
                formData.documents.forEach((file) => {
                    formDataToSend.append("verificationDocument", file);
                });
            }
    
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formDataToSend,
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.message || "Failed to create campaign");
            }
    
            if (result.success) {
                toast.success("🎉 Campaign Created! Your campaign has been created and is pending approval.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                
                resetForm();
            } else {
                throw new Error(result.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error creating campaign:", error);
            toast.error(`⚠ Error: ${error.message || "There was a problem creating your campaign."}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-6 max-w-3xl bg-soft-white animate-fade-in">
            <h1 className="text-3xl font-bold text-charcoal mb-6">
                Create a Campaign
            </h1>

            <Card className="bg-warm-beige shadow-md">
                <CardHeader>
                    <CardTitle className="text-forest-green">
                        Campaign Details
                    </CardTitle>
                    <CardDescription className="text-charcoal">
                        Fill out the details to start your crowdfunding
                        campaign. Once submitted, your campaign will be reviewed
                        for approval.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-charcoal">
                                    Campaign Title
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`focus:border-deep-emerald ${
                                        errors.title ? "border-coral-red" : ""
                                    }`}
                                    placeholder="Enter a catchy title for your campaign"
                                />
                                {errors.title && (
                                    <p className="text-coral-red text-sm">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-charcoal">
                                    Short Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`focus:border-deep-emerald ${
                                        errors.description ? "border-coral-red" : ""
                                    }`}
                                    placeholder="Provide a brief description (max 500 characters)"
                                    rows={3}
                                />
                                <div className="flex justify-between">
                                    <p className={errors.description ? "text-coral-red text-sm" : "text-charcoal text-sm"}>
                                        {errors.description || `${formData.description.length}/500 characters`}
                                    </p>
                                </div>
                            </div>

                            {/* Full Story */}
                            <div className="space-y-2">
                                <Label htmlFor="story" className="text-charcoal">
                                    Full Story
                                </Label>
                                <Textarea
                                    id="story"
                                    name="story"
                                    value={formData.story}
                                    onChange={handleChange}
                                    className={`focus:border-deep-emerald ${
                                        errors.story ? "border-coral-red" : ""
                                    }`}
                                    placeholder="Tell the complete story behind your campaign"
                                    rows={6}
                                />
                                {errors.story && (
                                    <p className="text-coral-red text-sm">
                                        {errors.story}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="category" className="text-charcoal font-medium">
                                        Category
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleSelectChange("category", value)}
                                    >
                                        <SelectTrigger
                                            className={`w-full rounded-full border px-4 py-2 text-sm shadow-sm bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-emerald ${
                                                errors.category ? "border-coral-red" : "border-mint-green"
                                            }`}
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
                                                    className="relative cursor-pointer px-4 py-2 text-sm text-charcoal hover:bg-mint-green/30 transition-all rounded-md data-[state=checked]:bg-mint-green/50 font-medium"
                                                >
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-coral-red font-medium">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Goal Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="goalAmount" className="text-charcoal">
                                        Goal Amount (₹)
                                    </Label>
                                    <Input
                                        id="goalAmount"
                                        name="goalAmount"
                                        type="number"
                                        value={formData.goalAmount}
                                        onChange={handleChange}
                                        className={`focus:border-deep-emerald ${
                                            errors.goalAmount ? "border-coral-red" : ""
                                        }`}
                                        placeholder="Enter your fundraising target"
                                        min="1"
                                    />
                                    {errors.goalAmount && (
                                        <p className="text-coral-red text-sm">
                                            {errors.goalAmount}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-charcoal">
                                    Campaign Duration (days)
                                </Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`focus:border-deep-emerald ${
                                        errors.duration ? "border-coral-red" : ""
                                    }`}
                                    placeholder="How many days will your campaign run?"
                                    min="1"
                                    max="90"
                                />
                                {errors.duration && (
                                    <p className="text-coral-red text-sm">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-6">
                                {/* Multiple Images Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="images" className="text-charcoal">
                                        Campaign Images (First image will be main image)
                                    </Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-soft-white transition-colors ${
                                            errors.images ? "border-coral-red" : "border-mint-green"
                                        }`}
                                        onClick={() => document.getElementById("images").click()}
                                    >
                                        <input
                                            id="images"
                                            name="images"
                                            type="file"
                                            accept="image/jpeg, image/png, image/jpg"
                                            multiple
                                            onChange={handleImagesChange}
                                            className="hidden"
                                        />
                                        <Upload className="w-10 h-10 mx-auto text-mint-green mb-2" />
                                        <p className="text-sm text-charcoal">
                                            Click to upload images (JPG, JPEG, PNG)
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Max 5 images (First image will be main image)
                                        </p>
                                    </div>
                                    
                                    {/* Image Previews */}
                                    {previewImages.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm text-charcoal mb-2">
                                                <span className="font-semibold">
                                                    {previewImages.length} image{previewImages.length !== 1 ? 's' : ''} selected
                                                </span>
                                                {previewImages.length >= 5 && (
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        (Maximum reached)
                                                    </span>
                                                )}
                                            </p>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {previewImages.map((url, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={url}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="h-32 w-full object-cover rounded-lg border border-gray-200"
                                                        />
                                                        {idx === 0 && (
                                                            <span className="absolute top-1 left-1 bg-forest-green text-white text-xs px-2 py-1 rounded-full">
                                                                Main Image
                                                            </span>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-1 right-1 bg-coral-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                            Image {idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <p className="text-xs text-gray-500 mt-2">
                                                First image will be used as the main campaign image.
                                            </p>
                                        </div>
                                    )}
                                    
                                    {errors.images && (
                                        <p className="text-coral-red text-sm">
                                            {errors.images}
                                        </p>
                                    )}
                                </div>

                                {/* Multiple Video Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="videos" className="text-charcoal">
                                        Campaign Videos
                                    </Label>
                                    <input
                                        id="videos"
                                        name="videos"
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        multiple
                                        onChange={handleVideosChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-mint-green file:text-white file:rounded-md file:cursor-pointer"
                                    />
                                    {previewVideos?.length > 0 && (
                                        <div className="space-y-2 mt-2">
                                            {previewVideos.map((url, idx) => (
                                                <video
                                                    key={idx}
                                                    src={url}
                                                    controls
                                                    className="w-full rounded-lg"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {errors.videos && (
                                        <p className="text-coral-red text-sm">
                                            {errors.videos}
                                        </p>
                                    )}
                                </div>

                                {/* Multiple Document Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="documents" className="text-charcoal">
                                        Verification Documents (PDF, DOCX)
                                    </Label>
                                    <input
                                        id="documents"
                                        name="documents"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        multiple
                                        onChange={handleDocumentsChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-mint-green file:text-white file:rounded-md file:cursor-pointer"
                                    />
                                    {uploadedDocuments?.length > 0 && (
                                        <ul className="list-disc list-inside text-sm mt-2">
                                            {uploadedDocuments.map((file, idx) => (
                                                <li key={idx}>
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {errors.documents && (
                                        <p className="text-coral-red text-sm">
                                            {errors.documents}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Guidelines */}
                            <Alert className="bg-mint-green/20 border-mint-green text-charcoal">
                                <AlertCircle className="h-4 w-4 text-forest-green" />
                                <AlertTitle>Important</AlertTitle>
                                <AlertDescription>
                                    By submitting this campaign, you agree to
                                    our terms and guidelines. All campaigns
                                    undergo a review process before being
                                    published.
                                </AlertDescription>
                            </Alert>
                        </div>

                        <CardFooter className="flex justify-end gap-4 px-0 pt-6 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-coral-red text-coral-red hover:bg-coral-red/10 px-4 py-2 rounded-full"
                                onClick={() => navigate("/dashboard")}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Create Campaign"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
            
            <ToastContainer />
        </div>
    );
};

export default CreateCampaign;