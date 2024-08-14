import {Request, Response} from "express";
import {prisma} from "../prisma";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {FirebaseError} from "firebase-admin";
import {statusOfShowcase} from "./utils";

export const getContentById = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const content = await prisma.contents.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const reportList = await prisma.reported_contents.findMany({
        where: {
          content_id: content.id,
          is_solved: {
            not: true,
          },
        },
      });

      if (reportList.length) {
        res.status(401).send({
          status: "error",
          data: "reported",
        });
        return;
      }
      const showcase = await prisma.showcases.findFirst({
        where: {
          content_id: content.id,
          status: statusOfShowcase.public,
          is_deleted: false,
        },
        include: {
          showcase_template: {},
          showcase_sample_items: {
            include: {
              sample_item: {
                include: {
                  digital_item: {
                    include: {
                      material_image: true,
                    },
                  },
                },
              },
            },
          },
          showcase_nft_items: {
            include: {
              digital_item_nft: {
                include: {
                  digital_item: {
                    include: {
                      material_image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      const owner = await prisma.accounts.findUnique({
        where: {
          uuid: content.businesses_uuid,
          is_deleted: false,
        },
      });
      if (!owner) {
        res.status(404).send({
          status: "error",
          data: "not-exist-owner",
        });
        return;
      }
      const sampleItems = showcase.showcase_sample_items.map((relationSample) => {
        return {
          sampleId: relationSample.sample_item_id,
          itemId: relationSample.id,
          thumbImage: relationSample.sample_item.digital_item.is_default_thumb ?
            relationSample.sample_item.digital_item.default_thumb_url :
            relationSample.sample_item.digital_item?.custom_thumb_url,
          materialUrl: relationSample.sample_item.digital_item.material_image?.image,
          modelType: relationSample.sample_item.digital_item.type,
          modelUrl: relationSample.sample_item.digital_item.model_url,
          stageType: relationSample.stage_type,
          scale: relationSample.scale,
          position: {
            x: relationSample.position[0] ?? 0,
            y: relationSample.position[1] ?? 0,
            z: relationSample.position[2] ?? 0,
          },
          rotation: {
            x: relationSample.rotation[0] ?? 0,
            y: relationSample.rotation[1] ?? 0,
            z: relationSample.rotation[2] ?? 0,
          },
        };
      });

      const nftItems = showcase.showcase_nft_items.map((relationNFT) => {
        return {
          nftId: relationNFT.nft_id,
          itemId: relationNFT.id,
          thumbImage: relationNFT.digital_item_nft.digital_item.is_default_thumb ?
            relationNFT.digital_item_nft.digital_item.default_thumb_url :
            relationNFT.digital_item_nft.digital_item.custom_thumb_url,
          materialUrl: relationNFT.digital_item_nft.digital_item.material_image?.image,
          modelType: relationNFT.digital_item_nft.digital_item.type,
          modelUrl: relationNFT.digital_item_nft.digital_item.model_url,
          stageType: relationNFT.stage_type,
          scale: relationNFT.scale,
          itemMeterHeight: relationNFT.meter_height,
          position: {
            x: relationNFT.position[0] ?? 0,
            y: relationNFT.position[1] ?? 0,
            z: relationNFT.position[2] ?? 0,
          },
          rotation: {
            x: relationNFT.rotation[0] ?? 0,
            y: relationNFT.rotation[1] ?? 0,
            z: relationNFT.rotation[2] ?? 0,
          },
        };
      });
      const favorite = await prisma.contents_favorite.findFirst({
        where: {
          account_uuid: uid,
          content_id: content.id,
        },
      });
      const settings = {
        wallpaper: {
          tint: showcase.wallpaper_tint,
        },
        floor: {
          tint: showcase.floor_tint,
        },
        lighting: {
          sceneLight: {
            tint: showcase.lighting_scene_tint,
            brightness: showcase.lighting_scene_brightness,
          },
          pointLight: {
            tint: showcase.lighting_point_tint,
            brightness: showcase.lighting_point_bright,
          },
        },
      };
      const returnData = {
        content: {
          id: content.id,
          name: content.name,
        },
        showcase: {
          id: showcase.id,
          title: showcase.title,
          description: showcase.description,
          showcaseType: showcase.showcase_template?.type,
          showcaseUrl: showcase.showcase_template?.model_url,
          settings: settings,
        },
        owner: {
          uuid: owner.uuid,
          avatar: owner.icon_url,
        },
        model: showcase.showcase_template?.model_url,
        thumbImage: showcase.thumb_url,
        items: [...sampleItems, ...nftItems],
        favorite: favorite!=null,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getContentByUuid = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {uid} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const ownerBusiness = await prisma.businesses.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!ownerBusiness) {
        res.status(404).send({
          status: "error",
          data: "not-business",
        });
        return;
      }
      const content = await prisma.contents.findUnique({
        where: {
          businesses_uuid: uid,
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-exist-content",
        });
        return;
      }
      const reportList = await prisma.reported_contents.findMany({
        where: {
          content_id: content.id,
          is_solved: {
            not: true,
          },
        },
      });

      if (reportList.length) {
        res.status(401).send({
          status: "error",
          data: "reported",
        });
        return;
      }
      const showcase = await prisma.showcases.findFirst({
        where: {
          content_id: content.id,
          status: statusOfShowcase.public,
        },
        include: {
          showcase_template: true,
          showcase_sample_items: {
            include: {
              sample_item: {
                include: {
                  digital_item: {
                    include: {
                      material_image: true,
                    },
                  },
                },
              },
            },
          },
          showcase_nft_items: {
            include: {
              digital_item_nft: {
                include: {
                  digital_item: {
                    include: {
                      material_image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!showcase) {
        res.status(404).send({
          status: "error",
          data: "not-exist-showcase",
        });
        return;
      }
      const owner = await prisma.accounts.findUnique({
        where: {
          uuid: content.businesses_uuid,
          is_deleted: false,
        },
      });
      if (!owner) {
        res.status(404).send({
          status: "error",
          data: "not-exist-owner",
        });
        return;
      }
      const sampleItems = showcase.showcase_sample_items.map((relationSample) => {
        return {
          sampleId: relationSample.sample_item_id,
          itemId: relationSample.id,
          thumbImage: relationSample.sample_item.digital_item.is_default_thumb ?
            relationSample.sample_item.digital_item.default_thumb_url :
            relationSample.sample_item.digital_item?.custom_thumb_url,
          materialUrl: relationSample.sample_item.digital_item.material_image?.image,
          modelType: relationSample.sample_item.digital_item.type,
          modelUrl: relationSample.sample_item.digital_item.model_url,
          stageType: relationSample.stage_type,
          scale: relationSample.scale,
          position: {
            x: relationSample.position[0] ?? 0,
            y: relationSample.position[1] ?? 0,
            z: relationSample.position[2] ?? 0,
          },
          rotation: {
            x: relationSample.rotation[0] ?? 0,
            y: relationSample.rotation[1] ?? 0,
            z: relationSample.rotation[2] ?? 0,
          },
        };
      });

      const nftItems = showcase.showcase_nft_items.map((relationNFT) => {
        return {
          nftId: relationNFT.nft_id,
          itemId: relationNFT.id,
          thumbImage: relationNFT.digital_item_nft.digital_item.is_default_thumb ?
            relationNFT.digital_item_nft.digital_item.default_thumb_url :
            relationNFT.digital_item_nft.digital_item.custom_thumb_url,
          materialUrl: relationNFT.digital_item_nft.digital_item.material_image?.image,
          modelType: relationNFT.digital_item_nft.digital_item.type,
          modelUrl: relationNFT.digital_item_nft.digital_item.model_url,
          stageType: relationNFT.stage_type,
          scale: relationNFT.scale,
          itemMeterHeight: relationNFT.meter_height,
          position: {
            x: relationNFT.position[0] ?? 0,
            y: relationNFT.position[1] ?? 0,
            z: relationNFT.position[2] ?? 0,
          },
          rotation: {
            x: relationNFT.rotation[0] ?? 0,
            y: relationNFT.rotation[1] ?? 0,
            z: relationNFT.rotation[2] ?? 0,
          },
        };
      });
      const favorite = await prisma.contents_favorite.findFirst({
        where: {
          account_uuid: decodedToken.uid,
          content_id: content.id,
        },
      });
      const settings = {
        wallpaper: {
          tint: showcase.wallpaper_tint,
        },
        floor: {
          tint: showcase.floor_tint,
        },
        lighting: {
          sceneLight: {
            tint: showcase.lighting_scene_tint,
            brightness: showcase.lighting_scene_brightness,
          },
          pointLight: {
            tint: showcase.lighting_point_tint,
            brightness: showcase.lighting_point_bright,
          },
        },
      };
      const returnData = {
        content: {
          id: content.id,
          name: content.name,
        },
        showcase: {
          id: showcase.id,
          title: showcase.title,
          description: showcase.description,
          showcaseType: showcase.showcase_template?.type,
          showcaseUrl: showcase.showcase_template?.model_url,
          settings: settings,
        },
        owner: {
          uuid: owner.uuid,
          avatar: owner.icon_url,
        },
        model: showcase.showcase_template?.model_url,
        thumbImage: showcase.thumb_url,
        items: [...sampleItems, ...nftItems],
        favorite: favorite!=null,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const updateMyContentInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {name, description, license, copyrightHolders, image, sticker}:
    { name?: string, description?: string, license?: string, copyrightHolders?: {id: number|null, name: string}[], image?: string, sticker?: string } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: true,
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      const reportList = await prisma.reported_contents.findMany({
        where: {
          content_id: admin.content?.id,
          is_solved: {
            not: true,
          },
        },
      });

      if (reportList.length) {
        res.status(401).send({
          status: "error",
          data: "reported",
        });
        return;
      }
      const timeDifference = new Date().getTime() - new Date(admin.content?.changed_name_time??"").getTime();
      if (timeDifference<3*30*24*60*60*1000&&name) {// 3 months
        res.status(401).send({
          status: "error",
          data: "can-not-change-name",
        });
        return;
      }
      const updatedContent = await prisma.contents.update({
        where: {
          id: admin.content?.id??0,
        },
        data: {
          changed_name: name,
          description: description,
          license: license,
          image: image,
          sticker: sticker,
          changed_name_time: name==undefined?undefined:new Date(),
        },
        include: {
          copyrights: true,
        },
      });
      if (copyrightHolders) {
        const copyrightIds = await Promise.all(
            copyrightHolders.map(async (copyright)=>{
              const upsertCopyright = await prisma.copyrights.upsert({
                where: {
                  id: copyright.id??0,
                },
                update: {
                  name: copyright.name,
                },
                create: {
                  name: copyright.name,
                  content_id: admin.content?.id??0,
                },
              });
              return upsertCopyright.id;
            })
        );
        await prisma.copyrights.deleteMany({
          where: {
            id: {
              notIn: copyrightIds,
            },
            content_id: admin.content?.id,
          },
        });
      }
      const copyrights = await prisma.copyrights.findMany({
        where: {
          content_id: updatedContent.id,
        },
      });
      const returnData = {
        id: updatedContent.id,
        name: updatedContent.name,
        description: updatedContent.description,
        license: updatedContent.license,
        image: updatedContent.image,
        sticker: updatedContent.sticker,
        copyright: copyrights.map((copyright) => {
          return {
            id: copyright.id,
            name: copyright.name,
          };
        }),
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getMyContentInfo = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: {
            include: {
              reported_contents: true,
              copyrights: true,
            },
          },
        },
      });
      if (!admin||!admin.content) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }

      if (admin.content?.reported_contents.filter((report)=>report.is_solved==null).length>0) {
        res.status(200).send({
          status: "error",
          data: "reported",
        });
        return;
      }

      if (admin.content?.reported_contents.filter((report)=>report.is_solved==false).length>0) {
        res.status(200).send({
          status: "error",
          data: "freezed",
        });
        return;
      }

      const returnData = {
        id: admin.content?.id,
        name: admin.content?.name,
        description: admin.content?.description,
        license: admin.content?.license,
        image: admin.content?.image,
        sticker: admin.content?.sticker,
        copyright: admin.content?.copyrights.map((copyright) => {
          return {
            id: copyright.id,
            name: copyright.name,
          };
        }),
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const setFavoriteContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {favorite}: { favorite: boolean } = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const content = await prisma.contents.findUnique({
        where: {
          id: parseInt(id),
          is_deleted: false,
        },
        include: {
          copyrights: true,
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-content",
        });
        return;
      }
      const reportList = await prisma.reported_contents.findMany({
        where: {
          content_id: content.id,
          is_solved: {
            not: true,
          },
        },
      });

      if (reportList.length) {
        res.status(401).send({
          status: "error",
          data: "reported",
        });
        return;
      }
      const nowFavorStatus = await prisma.contents_favorite.findMany({
        where: {
          account_uuid: uid,
          content_id: content.id,
        },
      });
      if (favorite && nowFavorStatus.length==0) {
        await prisma.contents_favorite.create({
          data: {
            content_id: content.id,
            account_uuid: uid,
          },
        });
      } else if (!favorite) {
        await prisma.contents_favorite.deleteMany({
          where: {
            content_id: content.id,
            account_uuid: uid,
          },
        });
      }
      const returnData = {
        id: content.id,
        favorite: favorite,
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getFavoriteContents = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const favorContents = await prisma.contents_favorite.findMany({
        where: {
          account_uuid: uid,
        },
        include: {
          content: {
            include: {
              reported_contents: {
                where: {
                  is_solved: {
                    not: true,
                  },
                },
              },
              showcases: true,
            },
          },
        },
      });
      const returnData:{
        id: number,
        name: string,
        thumbImage: string,
      }[] = [];
      favorContents.forEach((content) => {
        const mainShowcase = content.content.showcases.filter((showcase) => showcase.status == statusOfShowcase.public);
        if (!content.content.reported_contents.length) {
          returnData.push({
            id: content.content_id,
            name: content.content.name,
            thumbImage: mainShowcase[0].thumb_url,
          });
        }
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const reportContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  const {title, description} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const content = await prisma.contents.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-exits",
        });
        return;
      }
      const createReport = await prisma.reported_contents.create({
        data: {
          title: title,
          description: description,
          reporter_uuid: uid,
          content_id: content.id,
        },
      });
      res.status(200).send({
        status: "success",
        data: createReport.id,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const submitDocumentsReportContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {documents}:{documents: {
    documentName: string,
    documentLink: string,
  }[]} = req.body;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    try {
      const uid = decodedToken.uid;
      const admin = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: {
            include: {
              reported_contents: true,
              copyrights: true,
            },
          },
        },
      });
      if (!admin) {
        res.status(401).send({
          status: "error",
          data: "not-admin",
        });
        return;
      }
      if (!admin.content) {
        res.status(404).send({
          status: "error",
          data: "not-exits",
        });
        return;
      }
      const reportedContent = await prisma.reported_contents.findFirst({
        where: {
          content_id: admin.content.id,
          is_solved: null,
        },
      });
      if (!reportedContent) {
        res.status(401).send({
          status: "error",
          data: "not-reported",
        });
        return;
      }
      await prisma.reported_documents.createMany({
        data: documents.map((document)=>{
          return {
            reported_id: reportedContent.id,
            name: document.documentName,
            document_link: document.documentLink,
          }
        }),
      })
      res.status(200).send({
        status: "success",
        data: "uploaded",
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};

export const getDocumentsReportContent = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {id} = req.params;
  await getAuth().verifyIdToken(authorization ?? "").then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const content = await prisma.contents.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!content) {
        res.status(404).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      if (content.businesses_uuid!=uid) {
        res.status(401).send({
          status: "error",
          data: "not-owner",
        });
        return;
      }
      const reportedContent = await prisma.reported_contents.findFirst({
        where: {
          content_id: parseInt(id),
          is_solved: null,
        },
        include: {
          reported_documents: {
            orderBy: {
              created_date_time: "desc",
            },
          },
        },
      });
      if (!reportedContent) {
        res.status(401).send({
          status: "error",
          data: "not-reported",
        });
        return;
      }
      const returnData = reportedContent.reported_documents.map((document)=>{
        return {
          documentName: document.name,
          documentLink: document.document_link,
          uploadedTime: document.created_date_time,
        }
      })
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
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error,
    });
    return;
  });
};