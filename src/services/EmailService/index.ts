import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses'

export const sendEmail = async (
  email: string,
  subject: string,
  body: string
) => {
  const client = new SESClient({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
  try {
    const input: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.AWS_EMAIL_SOURCE!,
    }

    const command = new SendEmailCommand(input)

    await client.send(command)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to send email')
  }
}
