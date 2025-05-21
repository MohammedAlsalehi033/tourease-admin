'use client'
import 'reflect-metadata';
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { container } from "@/app/lib/diContainer";
import { UserController } from '@/app/(controller)/user/userController';



const UserProfilePage = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [user, setUser] = useState<any | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isBlocking, setIsBlocking] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setError("User ID is missing.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const userController = container.resolve(UserController);
                const response = await userController.getUserById(id);
                console.log("Fetched user data:", response);

                if (response && response.data) {
                     setUser(response.data);
                 } else if (response && response.id) { 
                     setUser(response);
                 } else {
                     setError("User data not found in expected format.");
                     setUser(null);
                 }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching user data.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleBlockUser = async () => {
        if (!id || isBlocking) return;
        const confirmBlock = window.confirm(`Are you sure you want to block this user?`);
        if (!confirmBlock) return;
        setIsBlocking(true);
        try {
            const userController = container.resolve(UserController);
            const blockResponse = await userController.blockUser(id);
            alert(blockResponse?.message || "User status updated.");

            if (blockResponse?.success && blockResponse?.data) {
                 setUser(blockResponse.data); 
            } else {
                 const updatedUser = await userController.getUserById(id);
                  if (updatedUser && updatedUser.data) {
                     setUser(updatedUser.data);
                 } else if (updatedUser && updatedUser.id) {
                     setUser(updatedUser);
                 }
            }
        } catch (err: any) {
            alert(`Failed to block user: ${err.message}`);
        } finally {
             setIsBlocking(false);
        }
    };


    const handleActivateUser = async ()=>{
               if (!id || !isBlocking) return;
        const confirmBlock = window.confirm(`Are you sure you want to Unblock this user?`);
        if (!confirmBlock) return;
        setIsBlocking(true);
        try {
            const userController = container.resolve(UserController);
            const blockResponse = await userController.blockUser(id);
            alert(blockResponse?.message || "User status updated.");

            if (blockResponse?.success && blockResponse?.data) {
                 setUser(blockResponse.data); 
            } else {
                 const updatedUser = await userController.getUserById(id);
                  if (updatedUser && updatedUser.data) {
                     setUser(updatedUser.data);
                 } else if (updatedUser && updatedUser.id) {
                     setUser(updatedUser);
                 }
            }
        } catch (err: any) {
            alert(`Failed to block user: ${err.message}`);
        } finally {
             setIsBlocking(false);
        }
    }
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading user profile...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">User not found.</div>;
    }

    const roleNames = user.roles && user.roles.length > 0
        ? user.roles.map((role: any) => role.role?.roleName || 'Unknown Role').join(', ')
        : 'No roles assigned';

    const formatDate = (dateString: string | null | undefined) => {
        return dateString ? new Date(dateString).toLocaleString() : 'N/A';
    }

    const renderListItem = (label: string, value: any) => (
        <p className="text-body-md truncate"><strong>{label}:</strong> {value ?? 'N/A'}</p>
    );

     const renderDetailItemCard = (item: any, index: number, title: string, details: Record<string, any>) => (
         <div key={`${title}-${item.id}-${index}`} className="border border-light-outline dark:border-dark-outline rounded-md p-3 mb-3">
             <h4 className="text-title-sm font-medium mb-1">{title} #{item.id}</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                 {Object.entries(details).map(([key, value]) => (
                     <div key={key} className="text-body-sm truncate">
                         <span className="font-medium">{key}:</span> {value ?? 'N/A'}
                     </div>
                 ))}
             </div>
         </div>
     );

    return (
        <div className="min-h-screen transition-colors duration-300 flex flex-col items-center justify-start pt-12 bg-light-background dark:bg-dark-background text-light-onSurface dark:text-dark-onSurface">

            <div className="max-w-4xl w-full px-4 md:px-6 mt-16 space-y-8 mb-12">
                <h1 className="text-headline-md font-semibold mb-6 text-center">User Profile</h1>

                {/* User Details Card */}
                <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                    <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">User Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        {renderListItem("ID", user.id)}
                        {renderListItem("Username", user.username)}
                        {renderListItem("Email", user.email)}
                        <div>
                            <p className="text-body-md">
                                <strong>Account Status:</strong>
                                <span className={`ml-2 px-2 py-0.5 rounded text-sm font-medium ${user.accountStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                    {user.accountStatus}
                                </span>
                            </p>
                        </div>
                        {renderListItem("Created At", formatDate(user.createdAt))}
                        {renderListItem("Updated At", formatDate(user.updatedAt))}
                        <div className="md:col-span-2">{renderListItem("Roles", roleNames)}</div>
                    </div>
                     <div className="mt-6 flex justify-end">
                         <button
                             onClick={handleBlockUser}
                             disabled={isBlocking || user.accountStatus === 'blocked'}
                             className={`btn-primary px-4 py-2 rounded text-white font-medium transition ${
                                 isBlocking || user.accountStatus === 'blocked'
                                 ? 'bg-gray-400 cursor-not-allowed'
                                 : 'bg-red-600 hover:bg-red-700'
                             }`}
                         >
                             {isBlocking ? 'Blocking...' : (user.accountStatus === 'blocked' ? 'User Blocked' : 'Block User')}
                         </button>
                     </div>
                </div>

                 {/* Transportation Provider Card */}
                 {user.transportationProvider && (
                     <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                         <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Transportation Provider Details</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                             {renderListItem("Vehicle Type", user.transportationProvider.vehicleType)}
                             {renderListItem("Seats Available", user.transportationProvider.seatsAvailable)}
                             {renderListItem("Provider Status", user.transportationProvider.accountStatus)}
                             {renderListItem("License Media", `${user.transportationProvider.licenseMmediaUrls?.length || 0} file(s)`)}
                             {renderListItem("Vehicle Media", `${user.transportationProvider.vehicleMediaUrls?.length || 0} file(s)`)}
                         </div>
                     </div>
                 )}

                  {/* Accommodation Provider Card */}
                 {user.accommodationProvider && (
                     <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                         <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Accommodation Provider Details</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                             {renderListItem("Accommodation Name", user.accommodationProvider.accommodationName)}
                             {renderListItem("Address", user.accommodationProvider.address)}
                             {renderListItem("Contact Number", user.accommodationProvider.contactNumber)}
                             {renderListItem("Media", `${user.accommodationProvider.mediaUrls?.length || 0} file(s)`)}
                         </div>
                     </div>
                 )}

                {/* --- Detailed Lists --- */}

                {/* Transportation Bookings */}
                {user.transportationBookings && user.transportationBookings.length > 0 && (
                    <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Transportation Bookings ({user.transportationBookings.length})</h2>
                        <div>
                            {user.transportationBookings.map((booking: any, index: number) => renderDetailItemCard(booking, index, 'Booking', {
                                Status: booking.status,
                                Price: `$${booking.totalPrice}`,
                                Seats: booking.seatsBooked,
                                Source: booking.bookingSource,
                                Listing: booking.listing ? `(${booking.listing.id}) ${booking.listing.startLocationText} -> ${booking.listing.endLocationText}` : 'N/A',
                                Request: booking.request ? `(${booking.request.id}) ${booking.request.startLocationText} -> ${booking.request.endLocationText}` : 'N/A',
                                Date: formatDate(booking.createdAt),
                            }))}
                        </div>
                    </div>
                )}

                 {/* Accommodation Bookings */}
                {user.accommodationBookings && user.accommodationBookings.length > 0 && (
                    <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Accommodation Bookings ({user.accommodationBookings.length})</h2>
                        <div>
                            {user.accommodationBookings.map((booking: any, index: number) => renderDetailItemCard(booking, index, 'Booking', {
                                Status: booking.status,
                                Price: `$${booking.totalPrice}`,
                                CheckIn: formatDate(booking.checkInDate),
                                CheckOut: formatDate(booking.checkOutDate),
                                RoomType: booking.room?.roomType,
                                Accommodation: booking.room?.accommodation?.name,
                                Date: formatDate(booking.createdAt),
                            }))}
                        </div>
                    </div>
                )}

                {/* Questions */}
                {user.questions && user.questions.length > 0 && (
                    <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Questions Asked ({user.questions.length})</h2>
                        <div>
                            {user.questions.map((q: any, index: number) => renderDetailItemCard(q, index, 'Question', {
                                Title: q.title,
                                Upvotes: q.upvotes,
                                Downvotes: q.downvotes,
                                Comments: q.comments?.length || 0,
                                Tags: q.tags?.join(', '),
                                Date: formatDate(q.createdAt),
                            }))}
                        </div>
                    </div>
                )}

                 {/* Offers Received */}
                 {user.receivedOffers && user.receivedOffers.length > 0 && (
                    <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Offers Received ({user.receivedOffers.length})</h2>
                        <div>
                            {user.receivedOffers.map((offer: any, index: number) => renderDetailItemCard(offer, index, 'Offer', {
                                Status: offer.status,
                                Price: `$${offer.pricePerSeat}/seat`,
                                Seats: offer.seatsRequested,
                                // Sender: offer.sender?.username, // Included in getUserById? Check your include logic
                                Listing: offer.listing?.id ? `Listing #${offer.listing.id}` : 'N/A',
                                Request: offer.request?.id ? `Request #${offer.request.id}` : 'N/A',
                                Date: formatDate(offer.createdAt),
                            }))}
                        </div>
                    </div>
                )}

                  {/* Offers Sent */}
                 {user.sentOffers && user.sentOffers.length > 0 && (
                    <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Offers Sent ({user.sentOffers.length})</h2>
                        <div>
                            {user.sentOffers.map((offer: any, index: number) => renderDetailItemCard(offer, index, 'Offer', {
                                Status: offer.status,
                                Price: `$${offer.pricePerSeat}/seat`,
                                Seats: offer.seatsRequested,
                                // Recipient: offer.recipient?.username, // Included in getUserById? Check your include logic
                                Listing: offer.listing?.id ? `Listing #${offer.listing.id}` : 'N/A',
                                Request: offer.request?.id ? `Request #${offer.request.id}` : 'N/A',
                                Date: formatDate(offer.createdAt),
                            }))}
                        </div>
                    </div>
                )}

                {/* Transportation Requests */}
                {user.TransportationRequest && user.TransportationRequest.length > 0 && (
                    <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Transportation Requests ({user.TransportationRequest.length})</h2>
                        <div>
                             {user.TransportationRequest.map((req: any, index: number) => renderDetailItemCard(req, index, 'Request', {
                                From: req.startLocationText,
                                To: req.endLocationText,
                                Time: formatDate(req.departureTime),
                                Seats: req.seatsNeeded,
                                Budget: `$${req.budget}`,
                                Offers: req.offers?.length || 0,
                                Bookings: req.bookings?.length || 0,
                                Date: formatDate(req.createdAt),
                            }))}
                        </div>
                    </div>
                )}


                {/* Reviews */}
                {user.reviews && user.reviews.length > 0 && (
                     <div className="card bg-light-surface dark:bg-dark-surface p-4 md:p-6 rounded-lg shadow-md">
                         <h2 className="text-title-lg font-medium mb-4 border-b pb-2 border-light-outline dark:border-dark-outline">Reviews Written ({user.reviews.length})</h2>
                         <div>
                             {user.reviews.map((review: any, index: number) => renderDetailItemCard(review, index, 'Review', {
                                 Rating: `${review.rating} / 5`,
                                 Type: review.reviewableType,
                                 Comment: review.comment,
                                 TargetID: review.transportationListingId || review.accommodationId || review.roomId || review.transportationBookingId || review.accommodationBookingId || 'N/A',
                                 Date: formatDate(review.createdAt),
                             }))}
                         </div>
                     </div>
                 )}


                 {/* Add similar sections for Trips, Votes, Comments, Messages, Notifications as needed */}

            </div>
        </div>
    );
};

export default UserProfilePage;