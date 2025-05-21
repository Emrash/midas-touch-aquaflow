import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectToEdit?: any;
}

const CLOUDINARY_CLOUD_NAME = "dlmrufbme";
const CLOUDINARY_UPLOAD_PRESET = "midas-touch";

const ProjectUploadModal = ({ isOpen, onClose, onSuccess, projectToEdit }: ProjectUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<"drilling" | "logistics" | "">("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setDescription(projectToEdit.description || "");
      setProjectType(projectToEdit.type || "");
      setCategory(projectToEdit.category || "");
      setLocation(projectToEdit.location || "");
      setExistingImageUrls(projectToEdit.imageUrls || []);
      setCompletedDate(
        projectToEdit.completedAt 
          ? new Date(projectToEdit.completedAt).toISOString().split('T')[0] 
          : ""
      );
    } else {
      resetForm();
    }
  }, [projectToEdit]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newFiles = files.slice(0, 3 - selectedFiles.length);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    
    if (!response.ok) {
      throw new Error('Image upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    const imageUrls: string[] = [];
    for (const file of selectedFiles) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Image upload failed",
          description: "One or more images failed to upload",
          variant: "destructive"
        });
      }
    }
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
    setExistingImageUrls([]);
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
    
    if (existingImageUrls.length + selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one project image",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadedUrls = await uploadImages();
      const allImageUrls = [...existingImageUrls, ...uploadedUrls];
      
      const projectData = {
        title,
        description,
        location,
        category: category || "",
        type: projectType,
        imageUrls: allImageUrls,
        completedAt: completedDate ? new Date(completedDate) : new Date(),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || "admin"
      };
      
      if (projectToEdit) {
        await updateDoc(doc(db, "projects", projectToEdit.id), projectData);
        toast({
          title: "Project updated",
          description: "The project has been updated successfully",
        });
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp(),
          createdBy: user?.uid || "admin",
          userId: user?.uid || "admin"
        });
        toast({
          title: "Project added",
          description: "The new project has been published to the website",
        });
      }
      
      resetForm();
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Failed to save project",
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
          <DialogTitle>
            {projectToEdit ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            {projectToEdit 
              ? "Update this project's details" 
              : "Create a new project to showcase on the website"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="type">Project Type *</Label>
                <Select 
                  value={projectType} 
                  onValueChange={(value: "drilling" | "logistics") => setProjectType(value)}
                  required
                >
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
            
            <div className="space-y-2">
              <Label htmlFor="date">Completion Date</Label>
              <Input
                id="date"
                type="date"
                value={completedDate}
                onChange={(e) => setCompletedDate(e.target.value)}
              />
            </div>
            
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
              
              {/* Existing images */}
              {existingImageUrls.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">Existing Images</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImageUrls.map((url, index) => (
                      <div key={`existing-${index}`} className="relative rounded-md overflow-hidden h-24 bg-gray-100">
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                          title="Remove image"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* New image previews */}
              {previewUrls.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">New Images</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={`new-${index}`} className="relative rounded-md overflow-hidden h-24 bg-gray-100">
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
              disabled={
                isUploading || 
                !title || 
                !description || 
                !projectType || 
                !location || 
                (existingImageUrls.length + selectedFiles.length === 0)
              }
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {projectToEdit ? "Updating..." : "Uploading..."}
                </>
              ) : (
                projectToEdit ? "Update Project" : "Add Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectUploadModal;