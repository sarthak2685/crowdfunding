
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, ImagePlus, AlertCircle } from 'lucide-react';

const categories = [
  'Education',
  'Medical',
  'Environment',
  'Community',
  'Technology',
  'Arts',
  'Sports',
];

const CreateCampaign = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goalAmount: '',
    duration: '30',
    story: '',
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Short description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description should be 200 characters or less';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.goalAmount) {
      newErrors.goalAmount = 'Goal amount is required';
    } else if (isNaN(formData.goalAmount) || parseFloat(formData.goalAmount) <= 0) {
      newErrors.goalAmount = 'Goal amount must be a positive number';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Campaign duration is required';
    }
    
    if (!formData.story.trim()) {
      newErrors.story = 'Campaign story is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Campaign image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // This would normally be a fetch to your API
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   formDataToSend.append(key, formData[key]);
      // });
      
      // const response = await fetch('http://localhost:5000/api/campaigns', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: formDataToSend
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to create campaign');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Campaign created successfully!',
        description: 'Your campaign has been submitted for review.',
        duration: 5000,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create campaign',
        description: error.message || 'An error occurred while creating your campaign.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create a Campaign</h1>
        <p className="text-gray-600">
          Share your idea with the world and start collecting funds.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Provide basic information about your campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`space-y-2 ${errors.title ? 'error-field' : ''}`}>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., Clean Water for Rural Communities"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" /> {errors.title}
                </p>
              )}
            </div>
            
            <div className={`space-y-2 ${errors.description ? 'error-field' : ''}`}>
              <Label htmlFor="description">
                Short Description <span className="text-gray-400 text-sm">(200 characters max)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Briefly describe your campaign in a sentence or two"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'border-red-500' : ''}
                rows={2}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Be clear and compelling</span>
                <span>{formData.description.length}/200</span>
              </div>
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" /> {errors.description}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`space-y-2 ${errors.category ? 'error-field' : ''}`}>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.category}
                  </p>
                )}
              </div>
              
              <div className={`space-y-2 ${errors.goalAmount ? 'error-field' : ''}`}>
                <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                <Input
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="E.g., 5000"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  className={errors.goalAmount ? 'border-red-500' : ''}
                />
                {errors.goalAmount && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.goalAmount}
                  </p>
                )}
              </div>
              
              <div className={`space-y-2 ${errors.duration ? 'error-field' : ''}`}>
                <Label htmlFor="duration">Campaign Duration (Days)</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleSelectChange(value, 'duration')}
                >
                  <SelectTrigger id="duration" className={errors.duration ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="45">45 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.duration}
                  </p>
                )}
              </div>
              
              <div className={`space-y-2 ${errors.image ? 'error-field' : ''}`}>
                <Label htmlFor="image">Campaign Image</Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="image"
                    className={`cursor-pointer border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center flex-1 ${
                      errors.image ? 'border-red-500' : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Campaign preview"
                        className="h-32 object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-gray-600">Upload Image</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max: 5MB)</span>
                      </>
                    )}
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </Label>
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle size={14} className="mr-1" /> {errors.image}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Campaign Story</CardTitle>
            <CardDescription>
              Tell donors why they should support your campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`space-y-2 ${errors.story ? 'error-field' : ''}`}>
              <Label htmlFor="story">Campaign Story</Label>
              <Textarea
                id="story"
                name="story"
                placeholder="Explain your campaign in detail. What problem are you solving? How will the funds be used? Why should people support your cause?"
                value={formData.story}
                onChange={handleChange}
                className={errors.story ? 'border-red-500' : ''}
                rows={10}
              />
              <p className="text-xs text-gray-500">
                Tip: Use clear, compelling language and be specific about your plans and goals.
              </p>
              {errors.story && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle size={14} className="mr-1" /> {errors.story}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
            <CardDescription>
              Review your campaign before submitting. Your campaign will be reviewed by our team before it's published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
              <h3 className="font-medium text-amber-800 mb-2">Important Notes:</h3>
              <ul className="list-disc pl-5 text-amber-700 text-sm space-y-1">
                <li>Your campaign will need approval before it's published on the platform.</li>
                <li>The review process typically takes 1-2 business days.</li>
                <li>Make sure all information provided is accurate and honest.</li>
                <li>Once approved, your campaign will be visible to all users on the platform.</li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Campaign'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateCampaign;
