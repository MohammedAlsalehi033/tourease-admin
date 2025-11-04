import { User } from "../users/userModel";

export interface TransportationProvider {
    providerId: string,
    licenseMmediaUrls: string[],
    vehicleMediaUrls:  string[],
    vehicleType: string,
    seatsAvailable: number,
    accountStatus: string,
    user: User,
}

export interface AccommodationProvider {
    providerId: string,
    licenseMmediaUrls: string[],
    vehicleMediaUrlsL:  string[],
    vehicleType: string,
    seatsAvailable: number,
    accountStatus: string,
    user: User,
}