import prisma from "@/app/libs/prismadb";
// This will be used by different pages in our app so can either be on the my reservations page in which case we get reservations that belong to userId
// or it's on the listing page in which case we get by listing id or we want to see who booked the airbnb we own
interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}
export default async function getReservations({
  listingId,
  userId,
  authorId,
}: IParams) {
  try {
    const query: any = {};
    if (listingId) {
      query.listingId = listingId;
    }
    if (userId) {
      query.userId = userId;
    }
    if (authorId) {
      query.listing = { userId: authorId };
    }
    const reservations = await prisma.reservation.findMany({
      where: query,
      include: { listing: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));
    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
