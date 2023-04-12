import prisma from "@/app/libs/prismadb";
export interface IListingParams {
  userId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  bathroomCount?: number;
  guestCount?: number;
  roomCount?: number;
}
export default async function getListings(params: IListingParams) {
  try {
    const {
      userId,
      category,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      guestCount,
      roomCount,
    } = params;
    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (category) {
      query.category = category;
    }
    if (roomCount) {
      query.roomCount = {
        // Greater than or equal to. The plus is important because roomCount is a string.
        gte: +roomCount,
      };
    }
    if (guestCount) {
      query.guestCount = {
        // Greater than or equal to. The plus is important because roomCount is a string.
        gte: +guestCount,
      };
    }
    if (bathroomCount) {
      query.bathroomCount = {
        // Greater than or equal to. The plus is important because roomCount is a string.
        gte: +bathroomCount,
      };
    }
    if (locationValue) {
      query.locationValue = locationValue;
    }
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              // We don't A reservation whose end date is after the start date and whose start date is less than the start date of requested reservation
              { endDate: { gte: startDate }, startDate: { lte: startDate } },
              // We also don't want reservation
              { startDate: { lte: endDate }, endDate: { gte: endDate } },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));
    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
