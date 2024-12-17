import {Request, Response, Router} from "express";
import {prisma} from "../../prisma";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const {pageNumber, pageSize} = req.query;

  const skip = (Number(pageNumber)-1)*Number(pageSize);
  console.log(skip);

  const users = await prisma.accounts.findMany({
    // skip: skip,
    // take: Number(pageSize),
    include: {
      business: true,
      my_reports: {
        orderBy: {
          created_date_time: "desc",
        },
      },
    },
  });
  const returnData = users.map((user)=>{
    const reportLog = user.my_reports.map((report)=>{
      return {
        title: report.title,
        description: report.title,
        dateAdded: report.created_date_time,
        isSolved: report.is_solved,
      };
    });
    return {
      id: user.id,
      uuid: user.uuid,
      userId: user.user_id,
      username: user.username,
      mail: user.email,
      birthday: user.birth,
      gender: user.gender,
      avatar: user.icon_url,
      note: user.note,
      tcp: user.business == null ? null: {
        joinTime: user.business.created_date_time,
      },
      reportsLog: reportLog,
    };
  });
  res.status(200).send({
    status: "success",
    data: returnData,
  });
});

router.put("/:uid/ignore-report", async (req: Request, res: Response) => {
  const {uid} = req.params;
  try {
    await prisma.reported_accounts.updateMany({
      where: {
        account_uuid: uid,
      },
      data: {
        is_solved: true,
      },
    });

    res.status(200).send({
      status: "success",
      data: "ignore",
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.put("/:uid/freeze-report", async (req: Request, res: Response) => {
  const {uid} = req.params;
  try {
    const process = await prisma.reported_accounts.updateMany({
      where: {
        account_uuid: uid,
        is_solved: null,
      },
      data: {
        is_solved: false,
      },
    });
    if (!process.count) {
      const suspend = await prisma.reported_accounts.create({
        data: {
          reporter_uuid: null,
          account_uuid: uid,
          title: "admin",
          description: "block",
          is_solved: false,
        },
      });
      res.status(200).send({
        status: "success",
        data: {
          date: suspend.created_date_time,
          title: suspend.title,
          description: suspend.description,
          isSolved: suspend.is_solved,
        },
      });
      return;
    }
    const totalReports = await prisma.reported_accounts.findMany({
      where: {
        account_uuid: uid,
      },
    });
    res.status(200).send({
      status: "success",
      data: totalReports.map((report)=>{
        return {
          date: report.created_date_time,
          title: report.title,
          description: report.description,
          isSolved: report.is_solved,
        };
      }),
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.put("/:uid/notes", async (req: Request, res: Response) => {
  const {uid} = req.params;
  const {note} = req.body;
  try {
    await prisma.accounts.update({
      where: {
        uuid: uid,
      },
      data: {
        note: note,
      },
    });
    res.status(200).send({
      status: "success",
      data: "saved",
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      data: error,
    });
  }
});

export const userRouter = router;
