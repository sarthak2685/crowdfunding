import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer } from 'react-toastify';
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
import { AlertCircle, CheckIcon, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateCampaign = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        story: "",
        category: "",
        goalAmount: "",
        duration: "",
        image: null,
    });

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

        // Clear error for the field
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

        // Clear error for the field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("images", files);
        setFormData({
            ...formData,
            image: files,
        });
        setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    };

    const handleVideosChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("videos", files);
        setFormData({
            ...formData,
            videos: files,
        });
        setPreviewVideos(files.map((file) => URL.createObjectURL(file)));
    };

    const handleDocumentsChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("files", files);
        setFormData({
            ...formData,
            documents: files,
        });
        setUploadedDocuments(files);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        if (!formData.story.trim()) newErrors.story = "Story is required";
        if (!formData.category) newErrors.category = "Category is required";

        if (!formData.goalAmount) {
            newErrors.goalAmount = "Goal amount is required";
        } else if (
            isNaN(formData.goalAmount) ||
            Number(formData.goalAmount) <= 0
        ) {
            newErrors.goalAmount = "Goal amount must be a positive number";
        }

        if (!formData.duration) {
            newErrors.duration = "Duration is required";
        } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
            newErrors.duration = "Duration must be a positive number";
        }

        if (!formData.image || formData.image.length === 0)
            newErrors.image = "Campaign image is required";
        console.log(
            "formData.image",
            formData.image,
            formData.videos,
            formData.documents
        );
        if (!formData.videos || formData.videos.length === 0)
            newErrors.videos = "At least one campaign video is required";
        if (!formData.documents || formData.documents.length === 0)
            newErrors.documents = "At least one document is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setIsSubmitting(true);

        const apiUrl = `${import.meta.env.VITE_API_URL}/campaigns`;

        try {
            // Create FormData for all data including files
            const formDataToSend = new FormData();

            // Append text fields
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("story", formData.story);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("goalAmount", formData.goalAmount);
            formDataToSend.append("duration", formData.duration);

            // Append files
            (formData.image || []).forEach((file, index) => {
                formDataToSend.append(`images`, file);
            });

            (formData.videos || []).forEach((file, index) => {
                formDataToSend.append(`videos`, file);
            });

            (formData.documents || []).forEach((file, index) => {
                formDataToSend.append(`verificationDocument`, file);
            });

            // Step 2: Send all data including files in one request
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    // Don't set Content-Type header - the browser will set it automatically with the correct boundary
                },
                body: formDataToSend,
            });

            const result = await response.json();

            if (result.success) {
                toast.success("🎉 Campaign Created! Your campaign has been created and is pending approval.", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                      backgroundColor: "#16a34a", // Tailwind's green-600
                      color: "white",
                      boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
                      border: "none",
                      width: "30%",
                      maxWidth: "400px",
                      zIndex: 9999,
                    },
                  });
                navigate("/dashboard");
            } else {
                toast.error(`❌ ${result.message || "Something went wrong. Please try again."}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: {
                      backgroundColor: "#d97706", // amber-600
                      color: "white",
                      boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
                      border: "none",
                      width: "30%",
                      maxWidth: "400px",
                      zIndex: 9999,
                    },
                  });
            }
        } catch (error) {
            console.error("Error creating campaign:", error);

            toast.error(`⚠️ Upload or Server Error: ${error.message || "There was a problem uploading your media."}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: {
                backgroundColor: "#dc2626", // Tailwind's red-600
                color: "white",
                boxShadow: "0 10px 15px rgba(0,0,0,0.3)",
                border: "none",
                width: "30%",
                maxWidth: "400px",
                zIndex: 9999,
              },
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
                                <Label
                                    htmlFor="title"
                                    className="text-charcoal"
                                >
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
                                <Label
                                    htmlFor="description"
                                    className="text-charcoal"
                                >
                                    Short Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`focus:border-deep-emerald ${
                                        errors.description
                                            ? "border-coral-red"
                                            : ""
                                    }`}
                                    placeholder="Provide a brief description (max 500 characters)"
                                    rows={3}
                                />
                                <div className="flex justify-between">
                                    <p
                                        className={
                                            errors.description
                                                ? "text-coral-red text-sm"
                                                : "text-charcoal text-sm"
                                        }
                                    >
                                        {errors.description ||
                                            `${formData.description.length}/500 characters`}
                                    </p>
                                </div>
                            </div>

                            {/* Full Story */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="story"
                                    className="text-charcoal"
                                >
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
                                    <Label
                                        htmlFor="category"
                                        className="text-charcoal font-medium"
                                    >
                                        Category
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            handleSelectChange(
                                                "category",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            className={`w-full rounded-full border px-4 py-2 text-sm shadow-sm bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-deep-emerald ${
                                                errors.category
                                                    ? "border-coral-red"
                                                    : "border-mint-green"
                                            }`}
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent
                                            className="bg-white rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                                            side="bottom"
                                            align="start"
                                        >
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
                                    <Label
                                        htmlFor="goalAmount"
                                        className="text-charcoal"
                                    >
                                        Goal Amount (₹)
                                    </Label>
                                    <Input
                                        id="goalAmount"
                                        name="goalAmount"
                                        type="number"
                                        value={formData.goalAmount}
                                        onChange={handleChange}
                                        className={`focus:border-deep-emerald ${
                                            errors.goalAmount
                                                ? "border-coral-red"
                                                : ""
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
                                <Label
                                    htmlFor="duration"
                                    className="text-charcoal"
                                >
                                    Campaign Duration (days)
                                </Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`focus:border-deep-emerald ${
                                        errors.duration
                                            ? "border-coral-red"
                                            : ""
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
                                    <Label
                                        htmlFor="images"
                                        className="text-charcoal"
                                    >
                                        Campaign Images
                                    </Label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-soft-white transition-colors ${
                                            errors.images
                                                ? "border-coral-red"
                                                : "border-mint-green"
                                        }`}
                                        onClick={() =>
                                            document
                                                .getElementById("images")
                                                .click()
                                        }
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
                                            Click to upload images (JPG, JPEG,
                                            PNG)
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Max size per file: 5MB
                                        </p>
                                    </div>
                                    {previewImages?.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            {previewImages.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="h-32 w-full object-cover rounded-lg"
                                                />
                                            ))}
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
                                    <Label
                                        htmlFor="videos"
                                        className="text-charcoal"
                                    >
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
                                    <Label
                                        htmlFor="documents"
                                        className="text-charcoal"
                                    >
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
                                            {uploadedDocuments.map(
                                                (file, idx) => (
                                                    <li key={idx}>
                                                        {file.name}
                                                    </li>
                                                )
                                            )}
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
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Create Campaign"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateCampaign;
