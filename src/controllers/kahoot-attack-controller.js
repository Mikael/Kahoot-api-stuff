const User = require("../models/User");
const MaskData = require("maskdata");

exports.sendattack = (req, res) => {
  const Kahoot = require("./src/kahoot");
  const testclient = new Kahoot();

  var client = [];
  var ongoingattacks = [];

  const apikey2 = req.header("x-api-key");
  const requesterIP = req.connection.remoteAddress;
  const APIPath = req.path;
  var sent = false
  console.log(`Requester IP: ${requesterIP} on API: ${APIPath}`);

  const maskStringOptions = {
    maskWith : "*",
    // Field names to mask. Can give multiple fields.
    values : ['8', '4', 'e', "5", 'c'], 
    maskOnlyFirstOccurance : false
    };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  User.findOne({ apiKey: apikey2 }).exec((err, user) => {
    if (err) return res.status(400).json({ err });

    if (user) {
      // return res.status(200).json({ user });
      const strAfterMasking = MaskData.maskString(apikey2, maskStringOptions);

      if (user.apibanned) return res.status(403).json({ error: `API Key: '${apikey2}' is suspended. Please contact tear#0001 for more information` });
      if (user.kahootapi_access == false) return res.status(403).json({ error: `API Key: '${strAfterMasking}' does not have access to this API. Contact tear#0001 if you believe this is an mistake.` });
      if (!req.header("gamePin")) return res.status(403).json({ error: `Invalid GamePin` });
      if (!req.header("botname")) return res.status(403).json({ error: `Invalid Bot name` });

      if (req.header("botamount") > 100) return res.status(403).json({ error: `API Server only allows maximum of '100' bot's sent at once` });
      if (req.header("botamount") > user.amount) return res.status(403).json({ error: `You've exceeded the plan's maximun bots. Max: '${user.amount}' bots allowed in your plan.` });

      ongoingattacks.push(`${req.header("gamePin")}:${req.header("botamount")}`)
      console.log(ongoingattacks)
      testclient.join(req.header("gamePin"), "GameChecker_BOT" + Math.floor()).catch(error => {
        //res.status(403).json({ success: `Joining` });
        if (error.description == "Session doesn\'t exist" || error.description == "Session doesn't exist") {
          res.status(403).json({ error: `${error.description}` });
          return;
        }

        testclient.on("Joined", () => {
          ready = true
          console.log("Valid game, Marked game as ready")
          setTimeout(() => {
            testclient.leave(true)
            //res.status(403).json({ success: `Valid gamepin` });
          }, 3000);
          
        })
      })

      for (var i = 0; i < req.header("botamount"); i++) {
        if (i + 1 > 100) return res.status(403).json({ error: `API Server only allows maximum of '100' bot's sent at once` });
        client.push(new Kahoot);

        client[i].join(req.header("gamePin"), req.header("botname") + Math.floor(Math.random() * 100) + String(i)).catch(error => {
          console.log("Could not join because : " + error.description)
        })

        // client[i].on("Joined", () => {
        //   console.log("A bot successfully joined game")
        // });
        client[i].on("QuestionStart", (question) => {
          setTimeout(() => {
            question.answer(Math.floor(Math.random() * question.quizQuestionAnswers[question.questionIndex]) + 0
            )
          }, getRandomInt(1, 3000));
        });
        client[i].on("Disconnect", (reason) => {
          if (reason == "Kicked") return console.log("Bot got kicked, so aint ending game..")
          if (reason == "Session Ended") {
            for (var i = 0; i < ongoingattacks.length; i++) {
              if (i = 0) return;
              if (ongoingattacks[i] === `${req.header("gamePin")}:${req.header("botamount")}`) {
                ongoingattacks.splice(i, 1);
                console.log(ongoingattacks)
                //res.status(200).json({ sucess: `Game ended, removed game from ongoing attacks.` });
                i = i--
                return;
              }
            }
          }
        });
      }
      res.status(200).json({ success: `Attack has been sent to ${req.header("gamePin")} with ${req.header("botamount")} bots!` });
    } else {
      return res.status(403).json({ error: "API key does not exist." });
    }
  });
};

exports.stopattack = (req, res) => {
  const apikey2 = req.header("x-api-key");
  const requesterIP = req.connection.remoteAddress;
  const APIPath = req.path;
  const gamepin = req.header("gamePin");

  console.log(`Requester IP: ${requesterIP} on API: ${APIPath}`);

  User.findOne({ apiKey: apikey2 }).exec((err, user) => {
    if (err) return res.status(400).json({ error: `Please report this error to tear#0001: ${err}` });

    if (user) {
      if (user.apibanned) return res.status(403).json({ error: `API Key: '${apikey2}' is suspended. Please contact tear#0001 for more information` });
      if (!gamepin) return res.status(403).json({ error: `Invalid GamePin` });

      return res.status(403).json({ error: "This Method is currently under maintenance. Please try again later!" });
    } else {
      return res.status(403).json({ error: "API key does not exist." });
    }
  });
};
