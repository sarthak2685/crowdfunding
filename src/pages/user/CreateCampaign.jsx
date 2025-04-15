import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    const [previewUrl, setPreviewUrl] = useState("");

    const categories = [
        "Education",
        "Medical",
        "Environment",
        "Community",
        "Technology",
        "Arts",
        "Sports",
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({
                    ...errors,
                    image: "Image size should not exceed 5MB",
                });
                return;
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(file.type)) {
                setErrors({
                    ...errors,
                    image: "Only JPG, JPEG, and PNG images are allowed",
                });
                return;
            }

            setFormData({
                ...formData,
                image: file,
            });

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear error
            if (errors.image) {
                setErrors({
                    ...errors,
                    image: "",
                });
            }
        }
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

        if (!formData.image) newErrors.image = "Campaign image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("story", formData.story);
            data.append("category", formData.category);
            data.append("goalAmount", formData.goalAmount);
            data.append("duration", formData.duration);
            data.append("image", formData.image);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/campaigns`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: data,
                }
            );

            const result = await response.json();

            if (result.success) {
                toast({
                    title: "🎉 Campaign Created!",
                    description: "Your campaign has been created and is pending approval.",
                    variant: "success", // Assuming your toast supports 'success' variant
                    duration: 4000,
                    className: "bg-green-600 text-white border-none shadow-xl",
                    style: {
                      position: "fixed",
                      top: "1rem",
                      right: "1rem",
                      zIndex: 9999,
                    },
                  });
                  

                navigate("/dashboard");
            } else {
                toast({
                    title: "❌ Failed to Create Campaign",
                    description: result.message || "Something went wrong. Please try again.",
                    variant: "destructive", // Ensures red styling if you're using shadcn/ui
                    duration: 5000,
                    className: "bg-red-600 text-white border-none shadow-xl",
                    style: {
                      position: "fixed",
                      top: "1rem",
                      right: "1rem",
                      zIndex: 9999,
                    },
                  });
                  
            }
        } catch (error) {
            console.error("Error creating campaign:", error);

toast({
  title: "⚠️ Server Error",
  description: "There was a problem connecting to the server. Please try again shortly.",
  variant: "destructive",
  duration: 5000,
  className: "bg-red-600 text-white border-none shadow-xl",
  style: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
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
                    <form onSubmit={handleSubmit}>
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
                            <div className="space-y-2">
                                <Label
                                    htmlFor="image"
                                    className="text-charcoal"
                                >
                                    Campaign Image
                                </Label>
                                <div className="flex flex-col gap-4">
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-soft-white transition-colors ${
                                            errors.image
                                                ? "border-coral-red"
                                                : "border-mint-green"
                                        }`}
                                        onClick={() =>
                                            document
                                                .getElementById("image")
                                                .click()
                                        }
                                    >
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/jpeg, image/png, image/jpg"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <Upload className="w-10 h-10 mx-auto text-mint-green mb-2" />
                                        <p className="text-sm text-charcoal">
                                            {previewUrl
                                                ? "Click to change image"
                                                : "Click to upload an image (JPG, JPEG, PNG)"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Max file size: 5MB
                                        </p>
                                    </div>

                                    {previewUrl && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium text-charcoal mb-2">
                                                Image Preview
                                            </p>
                                            <img
                                                src={previewUrl}
                                                alt="Campaign preview"
                                                className="max-h-48 rounded-lg mx-auto"
                                            />
                                        </div>
                                    )}

                                    {errors.image && (
                                        <p className="text-coral-red text-sm">
                                            {errors.image}
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
