
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateCampaign = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    story: '',
    category: '',
    goalAmount: '',
    duration: '',
    image: null,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const categories = [
    'Education',
    'Medical',
    'Environment',
    'Community',
    'Technology',
    'Arts',
    'Sports',
    'Elderly Care',
    'Child Welfare',
    'Other',
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
        [name]: '',
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
        [name]: '',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size should not exceed 5MB',
        });
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: 'Only JPG, JPEG, and PNG images are allowed',
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
          image: '',
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.story.trim()) newErrors.story = 'Story is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (!formData.goalAmount) {
      newErrors.goalAmount = 'Goal amount is required';
    } else if (isNaN(formData.goalAmount) || Number(formData.goalAmount) <= 0) {
      newErrors.goalAmount = 'Goal amount must be a positive number';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    if (!formData.image) newErrors.image = 'Campaign image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('story', formData.story);
      data.append('category', formData.category);
      data.append('goalAmount', formData.goalAmount);
      data.append('duration', formData.duration);
      data.append('image', formData.image);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: data,
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Campaign Created Successfully',
          description: 'Your campaign has been created and is pending approval.',
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: 'Failed to Create Campaign',
          description: result.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'There was a problem connecting to the server.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Create a Campaign</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>
            Fill out the details to start your crowdfunding campaign. Once submitted, your campaign will be reviewed for approval.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'border-red-500' : ''}
                  placeholder="Enter a catchy title for your campaign"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? 'border-red-500' : ''}
                  placeholder="Provide a brief description (max 500 characters)"
                  rows={3}
                />
                <div className="flex justify-between">
                  <p className={errors.description ? "text-red-500 text-sm" : "text-gray-500 text-sm"}>
                    {errors.description || `${formData.description.length}/500 characters`}
                  </p>
                </div>
              </div>
              
              {/* Full Story */}
              <div className="space-y-2">
                <Label htmlFor="story">Full Story</Label>
                <Textarea
                  id="story"
                  name="story"
                  value={formData.story}
                  onChange={handleChange}
                  className={errors.story ? 'border-red-500' : ''}
                  placeholder="Tell the complete story behind your campaign"
                  rows={6}
                />
                {errors.story && <p className="text-red-500 text-sm">{errors.story}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>
                
                {/* Goal Amount */}
                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                  <Input
                    id="goalAmount"
                    name="goalAmount"
                    type="number"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    className={errors.goalAmount ? 'border-red-500' : ''}
                    placeholder="Enter your fundraising target"
                    min="1"
                  />
                  {errors.goalAmount && <p className="text-red-500 text-sm">{errors.goalAmount}</p>}
                </div>
              </div>
              
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Campaign Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  className={errors.duration ? 'border-red-500' : ''}
                  placeholder="How many days will your campaign run?"
                  min="1"
                  max="90"
                />
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Campaign Image</Label>
                <div className="flex flex-col gap-4">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                    onClick={() => document.getElementById('image').click()}
                  >
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {previewUrl ? 'Click to change image' : 'Click to upload an image (JPG, JPEG, PNG)'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-2">Image Preview</p>
                      <img
                        src={previewUrl}
                        alt="Campaign preview"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                  
                  {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                </div>
              </div>
              
              {/* Terms and Guidelines */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  By submitting this campaign, you agree to our terms and guidelines. All campaigns undergo a review process before being published.
                </AlertDescription>
              </Alert>
            </div>
            
            <CardFooter className="flex justify-end gap-4 px-0 pt-6 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Create Campaign'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCampaign;
