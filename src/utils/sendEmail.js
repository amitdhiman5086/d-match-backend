const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: '<!DOCTYPE html><html><head><title>Birthday Invitation</title></head><body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-image: url(\'https://source.unsplash.com/1600x900/?birthday,party\'); background-size: cover; background-position: center; color: #ffffff; text-align: center;"><div style="background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 10px; max-width: 500px; margin: 100px auto;"><h1 style="font-size: 36px; margin-bottom: 10px;">You\'re Invited!</h1><p style="font-size: 18px; line-height: 1.6;">Hey [Friend\'s Name],</p><p style="font-size: 18px; line-height: 1.6;">I\'m throwing a birthday bash and would love to have you there to celebrate with me! 🎉</p><p style="font-size: 18px; line-height: 1.6;"><strong>Date:</strong> [Insert Date]<br><strong>Time:</strong> [Insert Time]<br><strong>Venue:</strong> [Insert Venue]</p><p style="font-size: 18px; line-height: 1.6;">It won’t be the same without you. Hope to see you there!</p><a href="#" style="display: inline-block; background-color: #ff4081; color: white; padding: 12px 20px; margin-top: 20px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">RSVP Now</a></div></body></html>',
        },

        Text: {
          Charset: "UTF-8",
          Data: "Hii Plain Text",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "From Backend",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "amitdhiman5086@gmail.com",
    "ad9306375664@gmail.com"
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
