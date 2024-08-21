import {Request, Response, Router} from "express";
import {prisma} from "../../prisma";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const {pageNumber, pageSize, favorOrderBy} = req.query;
  const favorOrderByString = favorOrderBy=="asc"?"asc":"desc";
  const skip = (Number(pageNumber)-1)*Number(pageSize);
  console.log(skip);

  try {
    const contents = await prisma.contents.findMany({
      // skip: skip,
      // take: Number(pageSize),
      include: {
        favorite_users: true,
        businesses: {
          include: {
            account: true,
          },
        },
        copyrights: true,
        reported_contents: true,
      },
      orderBy: {
        favorite_users: {
          _count: favorOrderByString,
        },
      },
    });
    const returnData = contents.map((content) => {
      const owner = content.businesses;
      return {
        id: content.id,
        name: content.name,
        description: content.description,
        hpURL: content.url,
        favorUserNum: content.favorite_users.length,
        owner: owner == null ? null : {
          id: owner.id,
          uuid: owner.uuid,
          userId: owner.account.user_id,
          name: owner.first_name + " " + owner.last_name,
          email: owner.email,
          phone: owner.phone,
          address: owner.province +
            " " + owner.city +
            " " + owner.street +
            " " + owner.building,
          country: owner.country,
          postalCode: owner.postal_code,
          birth: owner.birth,
        },
        copyrights: content.copyrights.map((copyright) => {
          return {
            id: copyright.id,
            name: copyright.name,
          };
        }),
        reports: content.reported_contents.filter((report) => report.is_solved != true).map((report) => {
          return {
            date: report.created_date_time,
            title: report.title,
            description: report.description,
          };
        }),
        license: content.license,
        licenseData: content.license_data,
      };
    });
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.get("/requests", async (req: Request, res: Response) => {
  const {pageNumber, pageSize} = req.query;
  const skip = (Number(pageNumber) - 1) * Number(pageSize);
  console.log(skip);

  try {
    const contents = await prisma.contents.findMany({
      // skip: skip,
      // take: Number(pageSize),
      where: {
        changed_name: {
          not: null,
        },
      },
      orderBy: {
        changed_name_time: "asc",
      },
    });
    const returnData = contents.map((content) => {
      return {
        id: content.id,
        name: content.name,
        sticker: content.sticker,
        requestName: content.changed_name,
        requestDate: content.changed_name_time,
        hpURL: content.url,
      };
    });
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.put("/requests", async (req: Request, res: Response) => {
  const {processType, contentIds}: { processType: boolean, contentIds: number[] } = req.body;
  try {
    if (processType) {
      const allRequests = await prisma.contents.findMany({
        where: {
          id: {
            in: contentIds,
          },
        },
      });
      await Promise.all(
          allRequests.map(async (content) => {
            await prisma.contents.update({
              where: {
                id: content.id,
              },
              data: {
                name: content.changed_name ?? "",
                changed_name: null,
              },
            });
          })
      );
    } else {
      const allRequests = await prisma.contents.findMany({
        where: {
          id: {
            in: contentIds,
          },
        },
      });
      await Promise.all(
          allRequests.map(async (content) => {
            await prisma.contents.update({
              where: {
                id: content.id,
              },
              data: {
                changed_name: null,
              },
            });
          })
      );
    }

    res.status(200).send({
      status: "success",
      data: "approved",
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.get("/notifications", async (req: Request, res: Response) => {
  try {
    const reportedContents = await prisma.reported_contents.findMany({
      include: {
        content: true,
      },
    });
    const returnData = reportedContents.filter((report)=>report.is_solved!=null).map((reportedContent) => {
      return {
        id: reportedContent.id,
        contentId: reportedContent.content_id,
      };
    });
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const content = await prisma.contents.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        favorite_users: true,
        businesses: {
          include: {
            account: true,
          },
        },
        copyrights: true,
        reported_documents: {
          orderBy: {
            created_date_time: "desc",
          },
        },
        reported_contents: {
          include: {
            reporter: true,
          },
        },
      },
    });
    if (!content) {
      res.status(404).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }
    const documents = content.reported_documents.map((document) => {
      return {
        documentName: document.name,
        documentLink: document.document_link,
        uploadedTime: document.created_date_time,
      };
    });
    const reports = content.reported_contents.map((report) => {
      return {
        date: report.created_date_time,
        title: report.title,
        description: report.description,
        isSolved: report.is_solved,
        reporter: {
          uuid: report.reporter.uuid,
          avatar: report.reporter.icon_url,
          username: report.reporter.username,
        },
      };
    });
    const returnData = {
      id: content.id,
      name: content.name,
      description: content.description,
      hpURL: content.url,
      sticker: content.sticker,
      image: content.image,
      favorUserNum: content.favorite_users.length,
      owner: content.businesses == null ? null : {
        id: content.businesses.id,
        uuid: content.businesses.uuid,
        userId: content.businesses.account.user_id,
        name: content.businesses.first_name + " " + content.businesses.last_name,
        email: content.businesses.email,
        phone: content.businesses.phone,
        address: content.businesses.province +
          " " + content.businesses.city +
          " " + content.businesses.street +
          " " + content.businesses.building,
        country: content.businesses.country,
        postalCode: content.businesses.postal_code,
        birth: content.businesses.birth,
      },
      documents: documents,
      reports: reports,
      copyrights: content.copyrights.map((copyright) => {
        return {
          id: copyright.id,
          name: copyright.name,
        };
      }),
      license: content.license,
      licenseData: content.license_data,
    };
    res.status(200).send({
      status: "success",
      data: returnData,
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

router.put("/:id/ignore-report", async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await prisma.reported_contents.updateMany({
      where: {
        content_id: parseInt(id),
        is_solved: null,
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

router.put("/:id/freeze-report", async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await prisma.reported_contents.updateMany({
      where: {
        content_id: parseInt(id),
        is_solved: null,
      },
      data: {
        is_solved: false,
      },
    });

    res.status(200).send({
      status: "success",
      data: "freeze",
    });
  } catch (error) {
    res.status(401).send({
      status: "error",
      data: error,
    });
  }
});

export const contentRouter = router;
