import prisma from "@/app/libs/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  listingId?: string;
}
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }
  // Using deleteMany because we cannot pass multiple where cases in delete regular
  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      // AND
      userId: currentUser.id,
    },
  });
  return NextResponse.json(listing);
}
