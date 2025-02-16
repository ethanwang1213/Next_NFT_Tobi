import {Request, Response} from "express";
import {FirebaseError, auth, firestore} from "firebase-admin";
import {DecodedIdToken, getAuth} from "firebase-admin/auth";
import {createFlowAccount} from "../createFlowAccount";
import {UserRecord} from "firebase-functions/v1/auth";
import {ContentData, convertBaseString, increaseTransactionAmount, isEmptyObject, isValidUserId, statusOfLimitTransaction, statusOfShowcase} from "./utils";
import {prisma} from "../prisma";
import {businessAccount, firstSaidanThumb, profiles} from "../lib/constants";

export const checkPasswordSet = async (req: Request, res: Response) => {
  const {email}: {email: string} = req.body;
  await auth().getUserByEmail(email).then((userRecord: UserRecord)=>{
    const providers = userRecord.providerData;

    const hasPasswordProvider = providers.some((provider) => provider.providerId === "password");

    if (hasPasswordProvider) {
      res.status(200).send({
        status: "success",
        data: true,
      });
    } else {
      res.status(200).send({
        status: "success",
        data: false,
      });
    }
  }).catch((error: FirebaseError) => {
    res.status(401).send({
      status: "error",
      data: error.code,
    });
  });
};

export const signUp = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await auth().verifyIdToken((authorization ?? "")).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    if (email==undefined) {
      res.status(401).send({
        status: "error",
        data: "anonymous-user",
      });
      return;
    }

    // Get unique string using timestamp.
    const timestamp = Date.now();
    const randomString = convertBaseString(timestamp);
    const username = "user-" + randomString;
    const userData = {
      uuid: uid,
      email: email,
      username: username,
      user_id: username,
    };
    try {
      let savedUser = await prisma.accounts.upsert({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        update: {},
        create: {...userData, first_saidan_id: 0},
      });
      const saidanTemplates = await prisma.saidans_template.findFirst({
        where: {
          id: 1,
        },
      });
      if (!savedUser.first_saidan_id) {
        const firstSaidan = await prisma.saidans.create({
          data: {
            account_uuid: uid,
            title: username,
            template_id: saidanTemplates?.id??1,
            thumbnail_image: firstSaidanThumb,
          },
        });
        await prisma.accounts.update({
          where: {
            uuid: uid,
            is_deleted: false,
          },
          data: {
            first_saidan_id: firstSaidan.id,
          },
        });
        savedUser = {...savedUser, first_saidan_id: firstSaidan.id};
      }

      const flowAcc = await prisma.flow_accounts.findUnique({
        where: {
          account_uuid: uid,
        },
      });
      if (decodedToken.email_verified && !flowAcc) {
        const {fcmToken}: { fcmToken?: string } = req.body;

        // console.log(`Flow account was not found: ${uid}`);
        const firestoreFlowAccounts = await firestore().collection("flowAccounts").where("tobiratoryAccountUuid", "==", uid).get();
        if (firestoreFlowAccounts.size <= 0) {
          // console.log("Creating...");
          await createFlowAccount(uid, fcmToken);
        } else {
          const existingFlowAccountSnapshot = firestoreFlowAccounts.docs[0];
          const data = existingFlowAccountSnapshot.data();

          if (data.txId) {
            // console.log("Found on Firestore");
            const flowJobs = await firestore().collection("flowJobs").where("txId", "==", data.txId).get();

            if (flowJobs.size <= 0) {
              // console.log("flowJobs has failed. Create again...");
              await createFlowAccount(uid, fcmToken);
            } else {
              // console.log("Attempting to store in database");
              const flowJob = flowJobs.docs[0].data();
              await prisma.flow_accounts.upsert({
                where: {
                  account_uuid: uid,
                },
                update: {
                  flow_address: data.address,
                  public_key: data.pubKey,
                  tx_id: data.txId,
                },
                create: {
                  account_uuid: uid,
                  flow_address: data.address,
                  public_key: data.pubKey,
                  tx_id: data.txId,
                  flow_job_id: flowJob.flowJobId,
                },
              });
            }
          } else {
            // console.log("txId is not found");
            await createFlowAccount(uid, fcmToken);
          }
        }
      }
      res.status(200).send({
        status: "success",
        data: {
          userId: savedUser.user_id,
          username: savedUser.username,
          email: savedUser.email,
          icon: savedUser.icon_url,
          sns: savedUser.sns,
          aboutMe: savedUser.about_me,
          socialLinks: savedUser.social_links,
          gender: savedUser.gender,
          birth: savedUser.birth,
          flow: flowAcc==null ? null : {
            flowAddress: flowAcc.flow_address,
            publicKey: flowAcc.public_key,
            txId: flowAcc.tx_id,
          },
          createdAt: savedUser.created_date_time,
        },
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

export const createFlowAcc = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    const checkLimit = await increaseTransactionAmount(uid);
    if (checkLimit == statusOfLimitTransaction.notExistAccount) {
      res.status(401).send({
        status: "error",
        data: "not-exist-account",
      });
      return;
    } else if (checkLimit == statusOfLimitTransaction.limitedTransaction) {
      res.status(401).send({
        status: "error",
        data: "transaction-limit",
      });
      return;
    }
    try {
      const flowAcc = await prisma.flow_accounts.findUnique({
        where: {
          account_uuid: uid,
          is_deleted: false,
        },
      });
      if (flowAcc) {
        res.status(200).send({
          status: "success",
          data: {
            flowAddress: flowAcc.flow_address,
            publicKey: flowAcc.public_key,
            txId: flowAcc.tx_id,
          },
        });
      }
      const {fcmToken}: { fcmToken?: string } = req.body;
      const flowInfo = await createFlowAccount(uid, fcmToken);
      const flowAccInfo = {
        account_uuid: uid,
        flow_job_id: flowInfo.flowJobId,
      };
      const flowData = await prisma.flow_accounts.create({
        data: flowAccInfo,
      });

      res.status(200).send({
        status: "success",
        data: {
          flowAddress: flowData.flow_address,
          publicKey: flowData.public_key,
          txId: flowData.tx_id,
        },
      });
    } catch (error) {
      res.status(401).send({
        status: "success",
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

export const getMyProfile = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken) => {
    const uid = decodedToken.uid;
    try {
      const accountData = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });

      if (!accountData) {
        res.status(401).send({
          status: "error",
          data: "Account does not exist!",
        });
        return;
      }

      const flowAccountData = await prisma.flow_accounts.findUnique({
        where: {
          account_uuid: uid,
          is_deleted: false,
        },
      });

      if (!flowAccountData) {
        res.status(401).send({
          status: "error",
          data: "Flow Account does not exist!",
        });
        return;
      }

      const resData = {
        userId: accountData.user_id,
        username: accountData.username,
        email: accountData.email,
        icon: accountData.icon_url,
        sns: accountData.sns,
        aboutMe: accountData.about_me,
        socialLinks: accountData.social_links,
        gender: accountData.gender,
        birth: accountData.birth,
        giftPermission: accountData.gift_permission,
        firstSaidan: {
          id: accountData.first_saidan_id,
          removedDefaultItem: accountData.removed_default_items,
        },
        flow: {
          flowAddress: flowAccountData.flow_address,
          publicKey: flowAccountData.public_key,
          txId: flowAccountData.tx_id,
        },
        createdAt: accountData.created_date_time,
      };
      res.status(200).send({
        status: "success",
        data: resData,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const postMyProfile = async (req: Request, res: Response) => {
  type AccountType = {
    userId?: string,
    username?: string,
    email?: string,
    icon?: string,
    sns?: string,
    aboutMe?: string,
    socialLinks?: Array<string>,
    gender?: string,
    birth?: string,
    giftPermission?: boolean
  }
  type FlowType = {
    flowAddress?: string,
    publicKey?: string,
    txId?: string,
  }
  const {authorization} = req.headers;
  const {account, flow}: { account?: AccountType; flow?: FlowType } = req.body;

  const accountUpdated = {
    user_id: account?.userId,
    username: account?.username,
    email: account?.email,
    icon_url: account?.icon,
    sns: account?.sns,
    about_me: account?.aboutMe,
    social_links: account?.socialLinks,
    gender: account?.gender,
    birth: account?.birth,
    gift_permission: account?.giftPermission,
  };
  const flowUpdated = {
    flow_address: flow?.flowAddress,
    public_key: flow?.publicKey,
    tx_id: flow?.txId,
  };
  await getAuth().verifyIdToken((authorization ?? "").toString()).then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      if (account?.userId) {
        // validate user id to match with our regex
        const validateUserId = isValidUserId(account?.userId);
        if (!validateUserId) {
          res.status(401).send({
            status: "error",
            data: "invalid-userId",
          });
        }

        // check double user id
        const doubleUsers = await prisma.accounts.findMany({
          where: {
            user_id: account?.userId,
          },
        });
        console.log(doubleUsers);

        if (doubleUsers.length>1) {
          res.status(401).send({
            status: "error",
            data: "double-userId",
          });
        }
      }

      let accountData; let flowData;
      const userExist = await prisma.accounts.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
      });
      if (!userExist) {
        res.status(401).send({
          status: "error",
          data: "not-exist-user",
        });
      }
      if (account&&isEmptyObject(account)) {
        await prisma.accounts.update({
          where: {
            uuid: uid,
          },
          data: accountUpdated,
        });
        accountData = await prisma.accounts.findUnique({
          where: {
            uuid: uid,
          },
        });
      }
      if (flow&&isEmptyObject(flow)) {
        flowData = await prisma.flow_accounts.update({
          where: {
            account_uuid: uid,
          },
          data: flowUpdated,
        });
      }
      const updatedProfileData = {
        userId: accountData?.user_id,
        username: accountData?.username,
        email: accountData?.email,
        icon: accountData?.icon_url,
        sns: accountData?.sns,
        aboutMe: accountData?.about_me,
        socialLinks: accountData?.social_links,
        gender: accountData?.gender,
        birth: accountData?.birth,
        firstSaidan: {
          id: accountData?.first_saidan_id,
          removedDefaultItem: accountData?.removed_default_items,
        },
        giftPermission: accountData?.gift_permission,
        createdAt: accountData?.created_date_time,
      };
      await firestore().collection(profiles).doc(uid).set(updatedProfileData, {merge: true});
      res.status(200).send({
        status: "success",
        data: {
          account: updatedProfileData,
          flow: flowData==null ? undefined : {
            flowAddress: flowData.flow_address,
            publicKey: flowData.public_key,
            txId: flowData.tx_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(401).send({
        status: "error",
        data: error,
      });
      return;
    }
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const myBusiness = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    try {
      const business = await prisma.businesses.findUnique({
        where: {
          uuid: uid,
          is_deleted: false,
        },
        include: {
          content: {
            include: {
              copyrights: true,
              license: true,
            },
          },
          account: true,
        },
      });
      if (!business) {
        res.status(401).send({
          status: "error",
          data: "not-exist",
        });
        return;
      }
      const date = new Date(business.birth);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const resData = {
        content: {
          name: business.content?.name,
          url: business.content?.url,
          description: business.content?.description,
        },
        user: {
          firstName: business.first_name,
          lastName: business.last_name,
          birthdayYear: year,
          birthdayMonth: month,
          birthdayDate: day,
          email: business.email,
          phone: business.phone,
          building: business.building,
          street: business.street,
          city: business.city,
          province: business.province,
          postalCode: business.postal_code,
          country: business.country,
        },
        copyright: {
          copyrightHolder: business.content?.copyrights.map((copyright)=>{
            return copyright.name;
          }),
          license: business.content?.license,
          file1: business.content?.license_data[0]??undefined,
          file2: business.content?.license_data[1]??undefined,
          file3: business.content?.license_data[2]??undefined,
          file4: business.content?.license_data[3]??undefined,
        },
      };
      res.status(200).send({
        status: "success",
        data: resData,
      });
    } catch (error) {
      res.status(401).send({
        status: "error",
        data: error,
      });
    }
  });
};

export const businessSubmission = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {
    content: {
      name: contentName,
      url,
      description,
    },
    user: {
      firstName,
      lastName,
      birthdayYear,
      birthdayMonth,
      birthdayDate,
      email,
      phone,
      building,
      street,
      city,
      province,
      postalCode,
      country,
    },
    copyright: {
      copyrightHolder,
      license,
      file1,
      file2,
      file3,
      file4,
    },
  } = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const birth = new Date(birthdayYear, birthdayMonth - 1, birthdayDate);
    const businessData = {
      uuid: uid,
      first_name: firstName,
      last_name: lastName,
      birth,
      email,
      country,
      postal_code: postalCode,
      province,
      city,
      street,
      building,
      phone,
      bank_account: "",
      balance: 0,
    };
    const contentData = {
      businesses_uuid: uid,
      name: contentName,
      image: "",
      url,
      description,
      license_data: [file1, file2, file3, file4].filter(Boolean),
    };
    try {
      const exist = await prisma.businesses.findFirst({
        where: {
          uuid: uid,
        },
        include: {
          content: {
            include: {
              reported_contents: true,
            },
          },
        },
      });
      if (exist&&exist.content?.is_approved != false) {
        res.status(400).send({
          status: "error",
          data: "already-exist",
        });
        return;
      }
      let returnData;
      if (!exist) {
        returnData = await prisma.$transaction(async (tx) => {
          const savedBusinessData = await tx.businesses.create({
            data: businessData,
          });
          const savedContentData = await tx.contents.create({
            data: {...contentData,
              license: {
                create: license,
              },
            },
          });

          const firestoreData: ContentData = {cmsApprove: null};
          firestore().collection(businessAccount).doc(uid).set(firestoreData);
          const copyrights = copyrightHolder.map((copyright: string)=>{
            return {
              name: copyright,
              content_id: savedContentData.id,
            };
          });
          await tx.copyrights.createMany({
            data: copyrights,
          });
          const showcaseTemplate = await tx.showcase_template.findUnique({
            where: {
              id: 1, // default template id
            },
          });
          if (!showcaseTemplate) {
            throw new Error("not-template");
          }
          await tx.showcases.create({
            data: {
              title: contentName,
              description: description,
              account_uuid: savedBusinessData.uuid,
              content_id: savedContentData.id,
              template_id: showcaseTemplate.id,
              thumb_url: showcaseTemplate.cover_image,
              status: statusOfShowcase.public,
            },
          });
          return {...savedBusinessData, content: {...savedContentData}};
        });
      } else {
        returnData = await prisma.$transaction(async (tx) => {
          const savedBusinessData = await tx.businesses.update({
            where: {id: exist.id},
            data: businessData,
          });
          const savedContentData = await tx.contents.update({
            where: {id: exist.id},
            data: {...contentData,
              is_approved: null,
              license: {
                update: license,
              },
            },
          });

          const firestoreData: ContentData = {cmsApprove: null};
          firestore().collection(businessAccount).doc(uid).set(firestoreData);
          const copyrights = copyrightHolder.map((copyright: string)=>{
            return {
              name: copyright,
              content_id: savedContentData.id,
            };
          });
          await tx.copyrights.deleteMany({
            where: {
              content_id: savedContentData.id,
            },
          });
          await tx.copyrights.createMany({
            data: copyrights,
          });
          const showcaseTemplate = await tx.showcase_template.findUnique({
            where: {
              id: 1, // default template id
            },
          });
          if (!showcaseTemplate) {
            throw new Error("not-template");
          }
          await tx.showcases.updateMany({
            where: {
              content_id: savedContentData.id,
            },
            data: {
              title: contentName,
              description: description,
              account_uuid: savedBusinessData.uuid,
              content_id: savedContentData.id,
              template_id: showcaseTemplate.id,
              thumb_url: showcaseTemplate.cover_image,
              status: statusOfShowcase.public,
            },
          });
          return {...savedBusinessData, content: {...savedContentData}};
        });
      }

      res.status(200).send({
        status: "success",
        data: returnData,
      });
    } catch (error: any) {
      if (error.message === "not-template") {
        res.status(401).send({
          status: "error",
          data: "not-template",
        });
      } else {
        console.error(error);
        res.status(500).send({
          status: "error",
          data: error,
        });
      }
    }
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const checkExistBusinessAcc = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const exist = await prisma.businesses.findFirst({
      where: {
        uuid: uid,
        is_deleted: false,
      },
      include: {
        content: {
          include: {
            reported_contents: true,
          },
        },
      },
    });

    if (!exist) {
      res.status(200).send({
        status: "error",
        data: "not-exist",
      });
      return;
    }

    if (exist?.content?.is_approved == null) {
      res.status(200).send({
        status: "error",
        data: "not-approved",
      });
      return;
    }

    if (exist?.content?.is_approved == false) {
      res.status(200).send({
        status: "error",
        data: "rejected",
        msg: exist?.content.handle_msg,
      });
      return;
    }

    if (exist.content?.reported_contents.filter((report)=>report.is_solved==null).length>0) {
      res.status(200).send({
        status: "error",
        data: "reported",
      });
      return;
    }

    if (exist.content?.reported_contents.filter((report)=>report.is_solved==false).length>0) {
      res.status(200).send({
        status: "error",
        data: "freezed",
      });
      return;
    }

    res.status(200).send({
      status: "success",
      data: "exist",
    });
  }).catch((error: FirebaseError)=>{
    res.status(401).send({
      status: "error",
      data: error,
    });
  });
};

export const updateMyBusiness = async (req: Request, res: Response) => {
  const {authorization} = req.headers;
  const {fistName, lastName, phone} = req.body;
  await getAuth().verifyIdToken(authorization??"").then(async (decodedToken: DecodedIdToken)=>{
    const uid = decodedToken.uid;
    const myBusiness = await prisma.businesses.updateMany({
      where: {
        uuid: uid,
        is_deleted: false,
      },
      data: {
        first_name: fistName,
        last_name: lastName,
        phone: phone,
      },
    });
    res.status(200).send({
      status: "success",
      data: myBusiness,
    });
  });
};
