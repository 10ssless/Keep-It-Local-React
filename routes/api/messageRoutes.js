const router = require("express").Router();
const db = require("../../models");
const connection = require('../../config/connection');

router.post("/all", function (req, res) {
    // create new message 
    let event_id = req.body.id;
    let content = escapeString(req.body.content);
    connection.query(`INSERT INTO Messages_${event_id}(content, creatorID) VALUES("${content}", "${req.user.userName}");`,
        function (err, result) {
            if (err) throw err.stack;
            console.table(result);
            res.end();
        });
});

router.get("/:id", function (req, res) {
    //get all messages from a certain event
    let event_id = req.params.id;
    console.log(`SELECT * FROM Messages_${event_id} ORDER BY id ASC`);
    // ============= mysql method =======================
    connection.query(`SELECT * FROM Messages_${event_id} ORDER BY id ASC`, function (err, result) {
        console.log(err);
        if (err) throw err.stack;
        console.table(result);
        let msgs_time = {
            result: result,
            time: result
        }
        res.send(result);
    });
});

function escapeString(str) {
    //used for making mysql queries with strings including special characters
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
            // and double/single quotes
        }
    });
}

module.exports = router;