import { Router } from "express";
import clerkClient from "../utils/clerk";
import { producer } from "../utils/kafka";
import { PhoneNumber } from "@clerk/express";

const router: Router = Router();

router.get("/", async (req, res) => {
  const users = await clerkClient.users.getUserList();
  res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await clerkClient.users.getUser(id);
  res.status(200).json(user);
});

router.post("/", async (req, res) => {
  try {
    type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
    const newUser: CreateParams = req.body;
    const user = await clerkClient.users.createUser(newUser);
    producer.send("user.created", {
      value: {
        username: user.username,
        email: user.emailAddresses[0]?.emailAddress,
      },
    });
    res.status(200).json(user);
  } catch(error: any) {
    res.status(422).json({ errors: error.errors });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    type UpdateParams = Parameters<
      typeof clerkClient.users.updateUser
    >[1];

    const updateData: UpdateParams = req.body;

    const updatedUser = await clerkClient.users.updateUser(
      id,
      updateData,
    );
    console.log(updateData)
    console.log(updatedUser)

    producer.send("user.updated", {
      value: {
        id: updatedUser.id,
        username: updatedUser.username,
        email:
          updatedUser.emailAddresses[0]?.emailAddress,
      },
      phone: updatedUser.phoneNumbers[0]?.phoneNumber
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(422).json({
      errors: error.errors || error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await clerkClient.users.deleteUser(id);
  res.status(200).json(user);
});

export default router;
