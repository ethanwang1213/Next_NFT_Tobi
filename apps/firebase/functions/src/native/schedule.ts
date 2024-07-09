import {REGION} from "../lib/constants";
import {prisma} from "../prisma";
import {statusOfShowcase} from "./utils";
import * as functions from "firebase-functions";

export const scheduleSystem = functions.region(REGION).pubsub.schedule("every 5 minutes").onRun(
    async (event) => {
      // schedule for digital items
      console.log(event);
      updateScheduleOfDigitalItem();
      updateScheduleOfShowcase();
    }
);

const updateScheduleOfDigitalItem = async () => {
  const digitalItems = await prisma.tobiratory_digital_items.findMany({
    where: {
      schedules: {
        isEmpty: false,
      },
    },
  });
  console.log(JSON.stringify(digitalItems));
  for (let i = 0; i < digitalItems.length; i++) {
    const element = digitalItems[i];
    for (let j = 0; j < element.schedules.length; j++) {
      const scheduleInfo: { status: number, datetime: string } = JSON.parse(element.schedules[j]);
      try {
        if (scheduleInfo.status < 1 || scheduleInfo.status > 7) {
          console.log("there is wrong status");
          continue;
        }
        const scheduleDate = +new Date(scheduleInfo.datetime);
        const nowDate = Date.now();
        if (Math.abs(nowDate - scheduleDate) < 1000 * 60 * 5) {
          await prisma.tobiratory_digital_items.update({
            where: {
              id: element.id,
            },
            data: {
              status: scheduleInfo.status,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const updateScheduleOfShowcase = async () => {
  const showcases = await prisma.tobiratory_showcase.findMany({
    where: {
      schedule_time: {
        not: null,
      },
    },
  });
  console.log(JSON.stringify(showcases));
  for (let i = 0; i < showcases.length; i++) {
    const element = showcases[i];
    try {
      const scheduleDate = +new Date(element.schedule_time??"");
      const nowDate = Date.now();
      if (Math.abs(nowDate - scheduleDate) < 1000 * 60 * 5) {
        const targetShowcase = await prisma.tobiratory_showcase.findUnique({
          where: {
            id: element.id,
          },
        });
        await prisma.tobiratory_showcase.updateMany({
          where: {
            owner_uuid: targetShowcase?.owner_uuid,
          },
          data: {
            status: statusOfShowcase.private,
          },
        });
        await prisma.tobiratory_showcase.update({
          where: {
            id: element.id,
          },
          data: {
            status: statusOfShowcase.public,
            schedule_time: null,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};
