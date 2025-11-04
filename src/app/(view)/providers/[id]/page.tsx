'use client'
import "reflect-metadata"; // Add this at the very top
import { useEffect, useState, } from 'react';
import { ChevronLeft, Users, Calendar, Car, CheckCircle, XCircle, Send, Image, Eye } from 'lucide-react';
import { useParams } from 'next/navigation'
import { container } from '@/app/lib/diContainer';
import { ProviderController } from '@/app/(controller)/providers/providerController';
import { TransportationProvider } from "@/app/(model)/providers/providersModel";
export default function TransportationProviderDetails() {
    const [provider, setProvider] = useState<TransportationProvider | null>(null);
    const params = useParams()
    const { id } = params
    
    
      const providerController = container.resolve(ProviderController);
    
      useEffect(() => {
        const fetchProviders = async () => {
          try {
            const response = await providerController.getTransportationProviderDetails(id!.toString());
            setProvider(response); // Set the state with the fetched data
            console.log(response)
          } catch (error) {
            console.error('Error fetching providers:', error);
          }
        };
    
        fetchProviders();
      }, [id]); 


  const [activeTab, setActiveTab] = useState('details');
  const [reviewMessage, setReviewMessage] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  const handleAccept = async () => {
    try {
        await providerController.approveTransportationProvider(id);
        alert("Provider approved successfully. You can use the previous screen for complete functionality.");
        window.location.reload();

    } catch (error) {
        console.error('Error approving provider:', error);
        alert("Failed to approve provider");
    }
};

const handleReject = async () => {
    try {
        await providerController.rejectTransportationProvider(id);
        alert("Provider rejected successfully. You can use the previous screen for complete functionality.");
        window.location.reload();

    } catch (error) {
        console.error('Error rejecting provider:', error);
        alert("Failed to reject provider");
    }
};
  const openImageViewer = (url) => {
    setSelectedImageUrl(url);
    setImageViewerOpen(true);
  };
 
  return (
    <div>
        {
            provider == null  ? (<div className=""></div>)   :   (
            <div>
              <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-start pt-12 bg-light-background dark:bg-dark-background">
    <p>Post: {id}</p>
      
      <div className="max-w-3xl w-full px-6 pb-24">
        {/* Provider ID Banner */}
        <div className="bg-primary bg-opacity-10 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary font-medium mr-2">Provider ID:</span>
            <span className="text-body-md">{provider.providerId}</span>
          </div>
          <span className="px-3 py-1 text-sm rounded-full bg-success text-white">
            {provider.accountStatus}
          </span>
        </div>
        
        {/* Image Gallery */}
        <div className="card mb-8">
          <h2 className="mb-4 text-headline-sm">Images</h2>
          
          <div className="mb-6">
            <h3 className="text-title-md mb-2">Vehicle Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {provider.licenseMmediaUrls.map((url, index) => (
                <div 
                  key={`vehicle-${index}`} 
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
                  onClick={() => openImageViewer(url)}
                >
                  <img 
                    src={url}
                    alt={`Vehicle ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                    <Eye size={16} className="text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-title-md mb-2">License Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {provider.licenseMmediaUrls.map((url, index) => (
                <div 
                  key={`license-${index}`}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
                  onClick={() => openImageViewer(url)}
                >
                  <img 
                    src={url}
                    alt={`License ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                    <Eye size={16} className="text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Provider Details */}
        <div className="card mb-8">
          <h2 className="mb-4 text-headline-sm">Provider Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Car className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="text-title-sm text-gray-500">Vehicle Type</p>
                <p className="text-body-lg">{provider.vehicleType}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="text-title-sm text-gray-500">Seats Available</p>
                <p className="text-body-lg">{provider.seatsAvailable}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="text-title-sm text-gray-500">Member Since</p>
                <p className="text-body-lg">{formatDate(provider.user.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Image className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="text-title-sm text-gray-500">Email</p>
                <p className="text-body-lg">{provider.user.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Review & Response Section */}
        <div className="card mb-8 ">
          <h2 className="mb-4 text-headline-sm">Review Provider</h2>
          
          <div className="mb-4 hidden">
            <label className="block text-title-md mb-2">Response Message</label>
            <textarea 
              className="input w-full h-32" 
              placeholder="Enter your response or rejection reason..."
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button 
              onClick={handleAccept}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Accept Provider
            </button>
            
            <button 
              onClick={handleReject}
              className="btn-outlined bg-error bg-opacity-10 text-error border-error flex-1 flex items-center justify-center"
            >
              <XCircle className="mr-2 h-5 w-5" />
              Reject Provider
            </button>
          </div>
        </div>
      </div>
      
      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full hidden bg-white dark:bg-gray-800 shadow-lg p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'images' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="btn-text flex items-center text-primary">
              <Send className="h-5 w-5 mr-1" />
              Send Message
            </button>
          </div>
        </div>
      </div>
      
      {/* Image Viewer Modal */}
      {imageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-screen overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-headline-sm">Image Viewer</h3>
              <button 
                onClick={() => setImageViewerOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center h-96">
              <img 
                src={selectedImageUrl!} 
                alt="Full size" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
            </div>
          )}
    </div>
  );
}










