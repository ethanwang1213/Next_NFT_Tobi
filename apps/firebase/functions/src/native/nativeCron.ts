import * as functions from "firebase-functions";
import {prisma} from "../prisma";
import {statusOfShowcase} from "./utils";
import {REGION} from "../lib/constants";

// This function will be triggered by a cron job using Firebase Scheduled Functions
export const cronForNative = functions.region(REGION).pubsub
    .schedule("every 1 minutes") // Adjust the schedule as needed
    .onRun(async (context) => {
      // Update status of showcases that are scheduled and should now be public
      updateShowcaseStatus();
    });

const updateShowcaseStatus = async () => {
  const now = new Date();

  // Find showcases that are scheduled and should now be public
  const showcasesToMakePublic = await prisma.showcases.findMany({
    where: {
      status: statusOfShowcase.publicSchedule,
      schedule_time: {
        lte: now,
      },
    },
  });

  for (const showcase of showcasesToMakePublic) {
    // Set previous public showcase to private
    await prisma.showcases.updateMany({
      where: {
        account_uuid: showcase.account_uuid,
        status: statusOfShowcase.public,
      },
      data: {
        status: statusOfShowcase.private,
      },
    });

    // Set the current scheduled showcase to public
    await prisma.showcases.update({
      where: {
        id: showcase.id,
      },
      data: {
        status: statusOfShowcase.public,
        schedule_time: null, // Clear the schedule time after making the showcase public
      },
    });
  }

  console.log("Cron job ran and updated showcase statuses");
  return null;
};
