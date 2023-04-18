require('dotenv').config(); // 皆採用 .env 讀取
const line = require('@line/bot-sdk');
const express = require('express');
const { Configuration, OpenAIApi } = require("openai"); // 他套件使用方式錯誤，我直接改掉
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const config = {
  channelAccessToken: "qjsJv8C5c14lzOwAy3p4u4NddWAp7tPJck45pCrNVB/wCqjIHXCjTVxvGI5J/cyvPGh1JAodB5w25tvZwd5KCdiBoWf+NaEb9QOcpOUwvKKZwWojyB1aBg3tHWX9qFUfRJ3/CApdfKyzOIBLa85VPQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "f93eb2617c4e625767a19787943e0ba4",
};

const client = new line.Client(config);

const app = express();

app.post('/webhook', line.middleware(config), async (req, res) => {
  console.log("req.body長這樣", req.body);
  console.log("req.body.message長這樣", req.body.events[0].message);

  try {
    console.log("跑try");
    const completion = await openai.createChatCompletion({
      // model: "gpt-3.5-turbo",
        model: "text-davinci-003",
      // messages: [{role: "user", content: req.body.events[0].message}],
      prompt: req.body.events[0].message,
    });


    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: req.body.events[0].message,
    // });

    console.log("completion長這樣",completion);
    // const message = completion.data.choices[0].text.trim();
    const result = completion
    // await client.replyMessage(req.body.events[0].replyToken, {
    //   type: 'text',
    //   text: message
    // });
    // const result = message;
    
    console.log("result長這樣",result)

    const reply = {
      type: "text",
      // text: result,
      text: "等等",
    };
    console.log("req.body.events[0].replyToken",req.body.events[0].replyToken)
    client.replyMessage(req.body.events[0].replyToken, reply);
  } catch (err) {
    console.log("失敗");
    res.status(500).end();
  }
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  try {
    const completion = await openai.createCompletion({
      prompt: event.message.text,
      model: "text-davinci-003",
      max_tokens: 1000
    });
    console.log("completion長這樣",completion);
    const message = completion.data.choices[0].text.trim();
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: message
    });
    return message;
  } catch (err) {
    // console.error(err);
    console.log("失敗");
    // throw err;
  }
}


app.listen(6666);
console.log('Linebot is running on 6666 port');