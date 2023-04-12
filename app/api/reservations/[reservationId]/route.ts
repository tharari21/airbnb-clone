import { getCurrentUser } from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
interface IParams {
  reservationId?: string;
}
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  // ONLY DELETE IF THE USER DELETING IS THE USER WHO MADE THE RESERVATION OR IF THE USER OWNS THE LISTING
  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listing: { userId: currentUser.id } }],
    },
  });
  return NextResponse.json(reservation);
}
