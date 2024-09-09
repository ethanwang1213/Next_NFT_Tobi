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
    },
  });
  const returnData = users.map((user)=>{
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
    };
  });
  res.status(200).send({
    status: "success",
    data: returnData,
  });
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
