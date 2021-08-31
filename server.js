const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const { urlencoded } = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/signup.html")
})

app.post("/", (req, res) => {
    const firstName = req.body.FirstName
    const lastName = req.body.LastName
    const mailAddress = req.body.email

    const data = {
        members: [
            {
                email_address: mailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us5.api.mailchimp.com/3.0/lists/c52362768c"
    const options = {
        method: "POST",
        auth: "Hario:b69c31b0e3bb2c90b176dff2d976a0bd-us5"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {

            // if (response.statusCode == 200) {
            //     res.sendFile(__dirname + "/client/success.html")
            // } else {
            //     res.sendFile(__dirname + "/client/failure.html")
            // }

            const statusCode = response.statusCode

            { statusCode === 200 ? res.sendFile(__dirname + "/client/success.html") : res.sendFile(__dirname + "/client/failure.html") }

            try {
                console.log(JSON.parse(data))
            } catch (err) {
                console.log(err.message)
            }
        })
    })

    request.write(jsonData)
    request.end()

    // console.log(`First Name : ${firstName}, \nLast Name : ${lastName}, \nEmail : ${mailAddress} `)
    // res.send("Romba sandhosama iruku nanbargale")


})

app.post("/failure", (req, res) => {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server running at Port 3000");
})

// api Key
// b69c31b0e3bb2c90b176dff2d976a0bd-us5
// listId
// c52362768c