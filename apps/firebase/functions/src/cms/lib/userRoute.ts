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

export const userRouter = router;
