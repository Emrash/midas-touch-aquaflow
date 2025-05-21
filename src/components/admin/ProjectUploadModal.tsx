
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, Timestamp, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ProjectUploadModal = ({ isOpen, onClose, onSuccess }: ProjectUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<"drilling" | "logistics" | "">("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  // For image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Limit to 3 images maximum
    const newFiles = files.slice(0, 3);
    setSelectedFiles(prev => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 3); // Ensure maximum 3 files
    });
    
    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => {
          const combined = [...prev, e.target?.result as string];
          return combined.slice(0, 3); // Ensure maximum 3 previews
        });
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    const imageUrls: string[] = [];
    console.log(`Starting upload of ${selectedFiles.length} images...`);
    
    for (const file of selectedFiles) {
      try {
        // Create a reference with a unique name
        const fileName = `${Date.now()}-${file.name}`;
        console.log(`Uploading image: ${fileName}`);
        
        const storageRef = ref(storage, `project-images/${fileName}`);
        console.log("Storage reference created:", storageRef);
        
        // Upload the file
        console.log("Starting uploadBytes operation...");
        const snapshot = await uploadBytes(storageRef, file);
        console.log("Image uploaded successfully:", snapshot.metadata.name);
        
        // Get the download URL
        console.log("Fetching download URL...");
        const downloadUrl = await getDownloadURL(storageRef);
        console.log("Generated download URL:", downloadUrl);
        
        imageUrls.push(downloadUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Image upload failed",
          description: "One or more images failed to upload",
          variant: "destructive"
        });
      }
    }
    
    console.log(`Successfully uploaded ${imageUrls.length} images.`);
    return imageUrls;
  };
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setProjectType("");
    setCategory("");
    setLocation("");
    setCompletedDate("");
    setSelectedFiles([]);
    setPreviewUrls([]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !projectType || !location) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one project image",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    console.log("Starting project upload process...");
    
    try {
      // 1. Upload images to Firebase Storage
      console.log("Step 1: Uploading images to Firebase storage...");
      console.log("Form data being submitted:", { 
        title, description, projectType, category, 
        location, completedDate,
        imageCount: selectedFiles.length
      });
      
      const imageUrls = await uploadImages();
      
      if (imageUrls.length === 0) {
        console.error("Error: No images were successfully uploaded");
        throw new Error("Failed to upload project images");
      }
      
      // 2. Create project document in Firestore
      console.log("Step 2: Creating project document in Firestore...");
      const projectData = {
        title,
        description,
        location,
        category: category || "",
        type: projectType,
        imageUrls,
        completedAt: completedDate ? new Date(completedDate) : new Date(),
        createdAt: serverTimestamp(), // Use server timestamp for more accuracy
        createdBy: user?.uid || "admin",
        userId: user?.uid || "admin"
      };
      
      console.log("Project data being saved:", projectData);
      
      // Add document to "projects" collection
      const docRef = await addDoc(collection(db, "projects"), projectData);
      
      console.log("Success! Project added with ID:", docRef.id);
      
      toast({
        title: "Project added successfully",
        description: "The new project has been published to the website",
      });
      
      // Reset form
      resetForm();
      
      // Close modal & refresh data if callback provided
      if (onSuccess) {
        console.log("Calling onSuccess callback to refresh projects list");
        onSuccess();
      }
      onClose();
      
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast({
        title: "Failed to add project",
        description: error.message || "There was an error saving your project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new project to showcase on the website. Add images, details and publish.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              {/* Project Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Project Type *</Label>
                <Select value={projectType} onValueChange={(value: "drilling" | "logistics") => setProjectType(value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drilling">Drilling</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Project Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Lagos, Nigeria"
                  required
                />
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Borehole, Infrastructure"
                />
              </div>
            </div>
            
            {/* Completion Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Completion Date</Label>
              <Input
                id="date"
                type="date"
                value={completedDate}
                onChange={(e) => setCompletedDate(e.target.value)}
              />
            </div>
            
            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project details, challenges and outcomes..."
                rows={5}
                required
              />
            </div>
            
            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Project Images *</Label>
              <div className="border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700 p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop project images, or
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Images
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      Upload up to 3 images (PNG, JPG)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24 bg-gray-100">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                        title="Remove image"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !title || !description || !projectType || !location || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectUploadModal;
